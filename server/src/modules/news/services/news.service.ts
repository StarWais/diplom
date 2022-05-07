import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';
import { Prisma, User } from '@prisma/client';

import { NewsGetFilter } from '../filters/news-get.filter';
import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { NewsCreateDto, NewsUpdateDto } from '../dto/request';
import { ImagesService } from '../../images/images.service';
import { NewsInclude } from '../interfaces';
import { NewsDto, NewsTagDto } from '../dto/response';
import { NewsNotFoundException } from '../exceptions';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImagesService,
  ) {}

  private readonly newsInclude: NewsInclude = {
    include: {
      tags: true,
    },
  };

  async findMany(details: NewsGetFilter): Promise<PaginatedDto<NewsDto>> {
    return Paginate<NewsDto, Prisma.NewsFindManyArgs>(
      {
        limit: details.limit,
        page: details.page,
      },
      this.prisma,
      'news',
      {
        where: {
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
              description: {
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
        ...this.newsInclude,
      },
      (news) => new NewsDto(news),
    );
  }

  private async generateSlug(title: string): Promise<string> {
    let slug = slugify(title, {
      replacement: '-',
      lower: true,
      locale: 'ru',
    });

    const slugExists = !!(await this.prisma.news.findUnique({
      where: {
        slug,
      },
    }));

    if (slugExists) {
      slug += `-${Date.now()}`;
    }
    return slug;
  }

  async tags(): Promise<Array<NewsTagDto>> {
    return this.prisma.newsTag.findMany();
  }

  async create(details: NewsCreateDto, currentUser: User): Promise<NewsDto> {
    const { image, tags, ...rest } = details;
    const slug = await this.generateSlug(details.title);
    const imageLink = await this.imageService.saveImage(image);
    const result = await this.prisma.news.create({
      data: {
        ...rest,
        slug,
        imageLink,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              name: tag.name,
            },
            create: tag,
          })),
        },
        author: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      ...this.newsInclude,
    });
    return new NewsDto(result);
  }

  async update(
    searchDetails: Prisma.NewsWhereUniqueInput,
    details: NewsUpdateDto,
  ): Promise<NewsDto> {
    await this.findOneOrThrowError(searchDetails);
    const { image, tags, ...rest } = details;
    const imageLink = image
      ? await this.imageService.saveImage(image)
      : undefined;
    const result = await this.prisma.news.update({
      where: searchDetails,
      data: {
        ...rest,
        imageLink,
        slug: details.title
          ? await this.generateSlug(details.title)
          : undefined,
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
    });
    return new NewsDto(result);
  }

  async findOneOrThrowError(
    searchDetails: Prisma.NewsWhereUniqueInput,
  ): Promise<NewsDto> {
    const result = await this.prisma.news.findUnique({
      where: searchDetails,
      ...this.newsInclude,
    });
    if (!result) {
      throw new NewsNotFoundException(searchDetails.id || searchDetails.slug);
    }
    return new NewsDto(result);
  }
}
