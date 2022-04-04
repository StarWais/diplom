import { Paginated } from './../common/pagination/pagination';
import { Injectable } from '@nestjs/common';
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
    const slug = slugify(details.title, {
      replacement: '-',
      lower: true,
      locale: 'ru',
    });
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
                id: tag.id,
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
          tags: true,
        },
      }),
    );
  }

  async get(details: Prisma.ArticleWhereUniqueInput): Promise<ArticleEntity> {
    return new ArticleEntity(
      await this.prisma.article.findUnique({
        where: details,
        include: {
          tags: true,
        },
      }),
    );
  }

  async publish(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleEntity> {
    return new ArticleEntity(
      await this.prisma.article.update({
        where: details,
        data: {
          status: ArticleStatus.PUBLISHED,
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
    return Paginate<ArticleEntity, Prisma.ArticleWhereInput>(
      {
        limit: details.limit,
        page: details.page,
      },
      this.prisma,
      'article',
      {
        status: ArticleStatus.PUBLISHED,
        authorId: details.authorId,
        OR: [
          {
            title: {
              contains: details.search,
            },
          },
          {
            content: {
              contains: details.search,
            },
          },
        ],
      },
      (article) => new ArticleEntity(article),
    );
  }

  async update(id: number, details: ArticleUpdateDto) {
    return new ArticleEntity(
      await this.prisma.article.update({
        where: {
          id,
        },
        data: {
          ...details,
          tags: {
            connectOrCreate: details.tags.map((tag) => ({
              where: {
                id: tag.id,
              },
              create: {
                name: tag.name,
              },
            })),
          },
        },
      }),
    );
  }

  async addComment() {}

  async removeComment() {}

  async like() {}
}
