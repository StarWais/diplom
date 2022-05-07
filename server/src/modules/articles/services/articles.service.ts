import { Injectable } from '@nestjs/common';
import { ArticleStatus, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { MailerService } from '@nestjs-modules/mailer';
import slugify from 'slugify';

import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { ArticleCreateDto, ArticleUpdateDto } from '../dto/request';
import { ArticlesGetFilter } from '../filters';
import { UsersService } from '../../users/users.service';
import { ArticleInclude } from '../interfaces';
import { ArticleDto, ArticleListedDto, ArticleTagDto } from '../dto/response';
import { ArticleNotFoundException } from '../exceptions';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  private articleIncludes: ArticleInclude = {
    include: {
      tags: true,
      author: true,
      likes: true,
      dislikes: true,
    },
  };

  private articleListedIncludes: ArticleInclude = {
    include: {
      tags: true,
      author: true,
    },
  };

  async create(
    details: ArticleCreateDto,
    currentUser: User,
  ): Promise<ArticleDto> {
    const { title, content, tags } = details;
    const slug = await this.generateSlug(details.title);
    const result = await this.prisma.article.create({
      data: {
        title,
        content,
        slug,
        status: currentUser.canPublish
          ? ArticleStatus.PUBLISHED
          : ArticleStatus.DRAFT,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              name: tag.name,
            },
            create: {
              name: tag.name,
            },
          })),
        },
        author: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      ...this.articleIncludes,
    });

    const article = new ArticleDto(result);

    if (article.status === ArticleStatus.DRAFT) {
      await this.notifyAdminsOnArticleCreate(article);
    }
    return article;
  }

  private async notifyAdminsOnArticleCreate(
    article: ArticleDto,
  ): Promise<void> {
    const adminMails = await this.usersService.getAdminConfirmedMails();
    if (adminMails.length > 0) {
      const { author, title, tags } = article;
      await this.mailerService.sendMail({
        to: adminMails,
        subject: 'Новая заявка на публикацию статьи',
        template: 'article-publish-request',
        context: {
          fullName: author.fullName,
          articleTitle: title,
          articleTag: tags.map((tag) => tag.name).join(', '),
        },
      });
    }
  }

  async findOneOrThrowError(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleDto> {
    const article = await this.prisma.article.findUnique({
      where: details,
      ...this.articleIncludes,
    });

    if (!article) {
      throw new ArticleNotFoundException(details.id || details.slug);
    }

    return new ArticleDto(article);
  }

  async publish(details: Prisma.ArticleWhereUniqueInput): Promise<ArticleDto> {
    const result = await this.prisma.article.update({
      where: details,
      data: {
        status: ArticleStatus.PUBLISHED,
      },
      ...this.articleIncludes,
    });

    return new ArticleDto(result);
  }

  async tags(): Promise<Array<ArticleTagDto>> {
    const tags = await this.prisma.articleTag.findMany();
    return tags.map((tag) => new ArticleTagDto(tag));
  }

  async findMany(
    details: ArticlesGetFilter,
    ignoreDrafts = false,
  ): Promise<PaginatedDto<ArticleListedDto>> {
    return Paginate<ArticleListedDto, Prisma.ArticleFindManyArgs>(
      {
        limit: details.limit,
        page: details.page,
      },
      this.prisma,
      'article',
      {
        where: {
          status: ignoreDrafts ? undefined : ArticleStatus.PUBLISHED,
          authorId: details.authorId,
          tags: {
            some: {
              name: {
                in: details.tags,
              },
            },
          },
          OR: [
            {
              title: {
                contains: details.search || '',
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: details.search || '',
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...this.articleListedIncludes,
      },
      (item) => new ArticleListedDto(item),
    );
  }

  private async slugExists(slug: string): Promise<boolean> {
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },
    });

    return !!article;
  }

  private async generateSlug(title: string): Promise<string> {
    let slug = slugify(title, {
      replacement: '-',
      lower: true,
      locale: 'ru',
    });

    const slugExists = await this.slugExists(slug);

    if (slugExists) {
      slug += `-${Date.now()}`;
    }
    return slug;
  }

  async update(
    searchDetails: Prisma.ArticleWhereUniqueInput,
    details: ArticleUpdateDto,
  ): Promise<ArticleDto> {
    const { title, tags, ...rest } = details;

    const result = await this.prisma.article.update({
      where: searchDetails,
      data: {
        ...rest,
        slug: title ? await this.generateSlug(title) : undefined,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((tag) => ({
                where: {
                  name: tag.name,
                },
                create: {
                  name: tag.name,
                },
              })),
            }
          : undefined,
      },
      ...this.articleIncludes,
    });
    return new ArticleDto(result);
  }

  async delete(details: Prisma.ArticleWhereUniqueInput): Promise<void> {
    await this.prisma.article.delete({
      where: details,
    });
  }

  async like(
    details: Prisma.ArticleWhereUniqueInput,
    currentUser: User,
  ): Promise<ArticleDto> {
    const article = await this.findOneOrThrowError(details);
    const userLike = article.likes.find(
      (like) => like.userId === currentUser.id,
    );
    const userDislike = article.dislikes.find(
      (dislike) => dislike.userId === currentUser.id,
    );

    const result = await this.prisma.article.update({
      where: details,
      data: {
        dislikes: userDislike
          ? {
              delete: {
                id: userDislike.id,
              },
            }
          : undefined,
        likes: userLike
          ? {
              delete: {
                id: userLike.id,
              },
            }
          : {
              create: {
                user: {
                  connect: {
                    id: currentUser.id,
                  },
                },
              },
            },
      },
      ...this.articleIncludes,
    });
    return new ArticleDto(result);
  }

  async dislike(
    details: Prisma.ArticleWhereUniqueInput,
    currentUser: User,
  ): Promise<ArticleDto> {
    const article = await this.findOneOrThrowError(details);
    const userLike = article.likes.find(
      (like) => like.userId === currentUser.id,
    );
    const userDislike = article.dislikes.find(
      (dislike) => dislike.userId === currentUser.id,
    );

    const result = await this.prisma.article.update({
      where: details,
      data: {
        likes: userLike
          ? {
              delete: {
                id: userLike.id,
              },
            }
          : undefined,
        dislikes: !userDislike
          ? {
              create: {
                user: {
                  connect: {
                    id: currentUser.id,
                  },
                },
              },
            }
          : {
              delete: {
                id: userDislike.id,
              },
            },
      },
      ...this.articleIncludes,
    });

    return new ArticleDto(result);
  }
}
