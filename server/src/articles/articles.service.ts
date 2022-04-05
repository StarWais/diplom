import { Paginated } from './../common/pagination/pagination';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleStatus, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';
import { Paginate } from 'src/common/pagination/pagination';
import { ArticleCreateDto, ArticleUpdateDto } from './dto';
import { ArticleEntity, ArticleTagEntity } from './entities';
import { ArticlesGetFilter } from './filters/articles-get-filter';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

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
              id: true,
            },
          },
        },
      }),
    );
  }
  async findOne(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleEntity> {
    return new ArticleEntity(
      await this.prisma.article.findUnique({
        where: details,
        include: {
          tags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
    );
  }
  async publish(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleEntity> {
    await this.checkExistance(details);
    return new ArticleEntity(
      await this.prisma.article.update({
        where: details,
        data: {
          status: ArticleStatus.PUBLISHED,
        },
        include: {
          tags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
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
            every: {
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
              id: true,
            },
          },
        },
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
  private async checkExistance(details: Prisma.ArticleWhereUniqueInput) {
    const article = await this.prisma.article.findUnique({
      where: details,
    });
    if (!article) {
      throw new NotFoundException('Статья не найдена');
    }
  }
  async update(
    searchDetails: Prisma.ArticleWhereUniqueInput,
    details: ArticleUpdateDto,
  ) {
    await this.checkExistance(searchDetails);
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
        include: {
          tags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
    );
  }
  async delete(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleEntity> {
    await this.checkExistance(details);
    return new ArticleEntity(
      await this.prisma.article.delete({
        where: details,
        include: {
          tags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
    );
  }
  async addComment() {}
  async removeComment() {}
  async like() {}
}
