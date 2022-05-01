import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NewsGetFilter } from './filters/news-get.filter';
import { Paginate } from '../common/pagination/pagination';
import { News, Prisma, User } from '@prisma/client';
import slugify from 'slugify';
import { NewsCreateDto } from './dto/request/news-create.dto';
import { ImagesService } from '../common/images/images.service';
import { NewsUpdateDto } from './dto/request/news-update.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImagesService,
  ) {}

  async findAll(details: NewsGetFilter) {
    return Paginate<News, Prisma.NewsFindManyArgs>(
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
                contains: details.search,
              },
            },
            {
              description: {
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
        orderBy: {
          createdAt: 'desc',
        },
      },
    );
  }

  private async generateSlug(title: string) {
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

  async tags() {
    return this.prisma.newsTag.findMany();
  }

  async create(details: NewsCreateDto, currentUser: User) {
    const { image, tags, ...rest } = details;
    const slug = await this.generateSlug(details.title);
    const imageLink = await this.imageService.saveImage(image);
    return this.prisma.news.create({
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
    });
  }

  async update(
    searchDetails: Prisma.NewsWhereUniqueInput,
    details: NewsUpdateDto,
  ) {
    await this.findOneOrThrowError(searchDetails);
    const { image, tags, ...rest } = details;
    const imageLink = image
      ? await this.imageService.saveImage(image)
      : undefined;
    return this.prisma.news.update({
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
  }

  async findOneOrThrowError(searchDetails: Prisma.NewsWhereUniqueInput) {
    const news = await this.prisma.news.findUnique({
      where: searchDetails,
    });
    if (!news) {
      throw new Error('Новость не найдена');
    }
    return news;
  }
}
