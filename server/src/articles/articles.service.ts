import { PaginationQuery } from './../common/pagination/pagination-query';
import { Paginated } from '../common/pagination/pagination';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleStatus, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';
import { Paginate } from '../common/pagination/pagination';
import {
  ArticleCommentCreateDto,
  ArticleCreateDto,
  ArticleUpdateDto,
} from './dto';
import {
  ArticleEntity,
  ArticleTagEntity,
  ArticleCommentEntity,
} from './entities';
import { ArticlesGetFilter } from './filters';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  private prismaArticleParams: Pick<Prisma.ArticleFindFirstArgs, 'include'> = {
    include: {
      tags: {
        select: {
          name: true,
        },
      },
      likes: {
        select: {
          userId: true,
          id: true,
        },
      },
      dislikes: {
        select: {
          userId: true,
          id: true,
        },
      },
    },
  };
  async create(
    details: ArticleCreateDto,
    currentUser: User,
  ): Promise<ArticleEntity> {
    const slug = await this.generateSlug(details.title);
    return new ArticleEntity(
      await this.prisma.article.create({
        data: {
          title: details.title,
          content: details.content,
          slug,
          status: currentUser.canPublish
            ? ArticleStatus.PUBLISHED
            : ArticleStatus.DRAFT,
          tags: {
            connectOrCreate: details.tags.map((tag) => ({
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
        include: {
          tags: {
            select: {
              name: true,
            },
          },
        },
      }),
    );
  }
  async findOne(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleEntity> {
    const article = await this.prisma.article.findUnique({
      where: details,
      ...this.prismaArticleParams,
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return new ArticleEntity(article);
  }
  async publish(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleEntity> {
    await this.findOne(details);
    return new ArticleEntity(
      await this.prisma.article.update({
        where: details,
        data: {
          status: ArticleStatus.PUBLISHED,
        },
        ...this.prismaArticleParams,
      }),
    );
  }
  async tags(): Promise<ArticleTagEntity[]> {
    return this.prisma.articleTag.findMany();
  }
  async findMany(
    details: ArticlesGetFilter,
  ): Promise<Paginated<ArticleEntity>> {
    return Paginate<ArticleEntity, Prisma.ArticleFindManyArgs>(
      {
        limit: details.limit,
        page: details.page,
      },
      this.prisma,
      'article',
      {
        where: {
          status: ArticleStatus.PUBLISHED,
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
              },
            },
            {
              content: {
                contains: details.search || '',
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...this.prismaArticleParams,
      },
      (article) => new ArticleEntity(article),
    );
  }
  private async generateSlug(title: string): Promise<string> {
    let slug = slugify(title, {
      replacement: '-',
      lower: true,
      locale: 'ru',
    });

    const slugExists = !!(await this.prisma.article.findUnique({
      where: {
        slug,
      },
    }));

    if (slugExists) {
      slug += `-${Date.now()}`;
    }
    return slug;
  }
  private async checkCommentExistance(
    details: Prisma.ArticleCommentWhereUniqueInput,
  ) {
    const comment = await this.prisma.articleComment.findUnique({
      where: details,
    });
    if (!comment) {
      throw new NotFoundException('Коментарий не найден');
    }
  }
  async update(
    searchDetails: Prisma.ArticleWhereUniqueInput,
    details: ArticleUpdateDto,
  ) {
    await this.findOne(searchDetails);
    const { title } = details;
    return new ArticleEntity(
      await this.prisma.article.update({
        where: searchDetails,
        data: {
          ...details,
          slug: title ? await this.generateSlug(title) : undefined,
          tags: details.tags
            ? {
                set: [],
                connectOrCreate: details.tags.map((tag) => ({
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
        ...this.prismaArticleParams,
      }),
    );
  }
  async delete(details: Prisma.ArticleWhereUniqueInput): Promise<void> {
    await this.findOne(details);
    await this.prisma.article.delete({
      where: details,
    });
  }
  async createComment(
    searchCommentDetails: Prisma.ArticleWhereUniqueInput,
    details: ArticleCommentCreateDto,
    user: User,
  ): Promise<ArticleCommentEntity> {
    await this.findOne(searchCommentDetails);
    return new ArticleCommentEntity(
      await this.prisma.articleComment.create({
        data: {
          ...details,
          article: {
            connect: {
              id: searchCommentDetails.id,
            },
          },
          author: {
            connect: {
              id: user.id,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
              avatar: {
                include: {
                  file: true,
                },
              },
            },
          },
        },
      }),
    );
  }
  async findComments(
    searchDetails: Prisma.ArticleWhereUniqueInput,
    paginationDetails: PaginationQuery,
  ): Promise<Paginated<ArticleCommentEntity>> {
    await this.findOne(searchDetails);
    return Paginate<ArticleCommentEntity, Prisma.ArticleCommentFindManyArgs>(
      paginationDetails,
      this.prisma,
      'articleComment',
      {
        where: {
          articleId: searchDetails.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
              avatar: {
                include: {
                  file: true,
                },
              },
            },
          },
        },
      },
      (comment) => new ArticleCommentEntity(comment),
    );
  }
  async deleteComment(
    details: Prisma.ArticleCommentWhereUniqueInput,
  ): Promise<void> {
    await this.checkCommentExistance(details);
    await this.prisma.articleComment.delete({
      where: details,
    });
  }
  async like(
    details: Prisma.ArticleWhereUniqueInput,
    user: User,
  ): Promise<ArticleEntity> {
    const article = await this.findOne(details);
    const userLike = article.likes.find((like) => like.userId === user.id);
    const userDislike = article.dislikes.find(
      (dislike) => dislike.userId === user.id,
    );
    return new ArticleEntity(
      await this.prisma.article.update({
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
                      id: user.id,
                    },
                  },
                },
              },
        },

        ...this.prismaArticleParams,
      }),
    );
  }
  async dislike(details: Prisma.ArticleWhereUniqueInput, user: User) {
    const article = await this.findOne(details);
    const userLike = article.likes.find((like) => like.userId === user.id);
    const userDislike = article.dislikes.find(
      (dislike) => dislike.userId === user.id,
    );

    return new ArticleEntity(
      await this.prisma.article.update({
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
                      id: user.id,
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
        ...this.prismaArticleParams,
      }),
    );
  }
}
