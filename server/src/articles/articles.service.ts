import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Article,
  ArticleStatus,
  Prisma,
  User,
  ArticleTag,
  ArticleComment,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';

import { PaginationQuery } from '../common/pagination/pagination-query';
import { Paginated } from '../common/pagination/pagination';
import { Paginate } from '../common/pagination/pagination';
import {
  ArticleCommentCreateDto,
  ArticleCreateDto,
  ArticleUpdateDto,
} from './dto';
import { ArticlesGetFilter } from './filters';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(details: ArticleCreateDto, currentUser: User): Promise<Article> {
    const slug = await this.generateSlug(details.title);

    return this.prisma.article.create({
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
    });
  }

  async findOne(details: Prisma.ArticleWhereUniqueInput) {
    const article = await this.prisma.article.findUnique({
      where: details,
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
    });

    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }

    return article;
  }

  async publish(details: Prisma.ArticleWhereUniqueInput): Promise<Article> {
    await this.findOne(details);

    return this.prisma.article.update({
      where: details,
      data: {
        status: ArticleStatus.PUBLISHED,
      },
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
    });
  }

  async tags(): Promise<ArticleTag[]> {
    return this.prisma.articleTag.findMany();
  }

  async findMany(details: ArticlesGetFilter): Promise<Paginated<Article>> {
    return Paginate<Article, Prisma.ArticleFindManyArgs>(
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
      },
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

  private async checkCommentExistence(
    details: Prisma.ArticleCommentWhereUniqueInput,
  ): Promise<void> {
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
  ): Promise<Article> {
    await this.findOne(searchDetails);
    const { title } = details;

    return this.prisma.article.update({
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
    });
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
  ): Promise<ArticleComment> {
    await this.findOne(searchCommentDetails);

    return this.prisma.articleComment.create({
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
                file: {
                  select: {
                    path: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findComments(
    searchDetails: Prisma.ArticleWhereUniqueInput,
    paginationDetails: PaginationQuery,
  ): Promise<Paginated<ArticleComment>> {
    await this.findOne(searchDetails);
    return Paginate<ArticleComment, Prisma.ArticleCommentFindManyArgs>(
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
                  file: {
                    select: {
                      path: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    );
  }

  async deleteComment(
    details: Prisma.ArticleCommentWhereUniqueInput,
  ): Promise<void> {
    await this.checkCommentExistence(details);
    await this.prisma.articleComment.delete({
      where: details,
    });
  }

  async like(
    details: Prisma.ArticleWhereUniqueInput,
    user: User,
  ): Promise<Article> {
    const article = await this.findOne(details);
    const userLike = article.likes.find((like) => like.userId === user.id);
    const userDislike = article.dislikes.find(
      (dislike) => dislike.userId === user.id,
    );

    return this.prisma.article.update({
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
    });
  }

  async dislike(details: Prisma.ArticleWhereUniqueInput, user: User) {
    const article = await this.findOne(details);
    const userLike = article.likes.find((like) => like.userId === user.id);
    const userDislike = article.dislikes.find(
      (dislike) => dislike.userId === user.id,
    );

    return this.prisma.article.update({
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
    });
  }
}
