import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, PublishingStatus, User } from '@prisma/client';

import { OlympicsBaseIncludes } from '../interfaces';
import { OlympicCreateDto, OlympicUpdateDto } from '../dto/request';
import { OlympicDto, OlympicListedMyDto } from '../dto/response';
import { OlympicNotFoundException } from '../exceptions';
import { ImagesService } from '@images/services';
import { GetOlympicsFilter, GetMyOlympicsFilter } from '../filters';
import { Paginate, PaginatedDto } from '@pagination/pagination';
import { OlympicListedBaseDto } from '../dto/response/olympic-listed-base.dto';

@Injectable()
export class OlympicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImagesService,
  ) {}

  private olympicsBaseIncludes: OlympicsBaseIncludes = {
    include: {
      steps: true,
      tags: true,
    },
  };

  private olympicWithStepsInclude: OlympicsBaseIncludes = {
    include: {
      steps: true,
    },
  };

  async create(details: OlympicCreateDto): Promise<OlympicDto> {
    const { steps, tags, image, ...rest } = details;
    const imageLink = await this.imageService.save(image);
    const result = await this.prisma.olympiad.create({
      data: {
        ...rest,
        imageLink,
        steps: {
          create: steps,
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              name: tag.name,
            },
            create: tag,
          })),
        },
      },
      ...this.olympicsBaseIncludes,
    });
    return new OlympicDto(result);
  }

  async findMany(
    filter: GetOlympicsFilter,
  ): Promise<PaginatedDto<OlympicListedBaseDto>> {
    return Paginate<Prisma.OlympiadFindManyArgs>(
      OlympicListedBaseDto,
      {
        page: filter.page,
        limit: filter.limit,
      },
      this.prisma,
      'olympiad',
      {
        where: {
          tags: {
            some: {
              name: {
                in: filter.tags,
              },
            },
          },
          grade: {
            equals: filter.grade,
          },
        },
        orderBy: {
          rating: 'desc',
        },
        ...this.olympicWithStepsInclude,
      },
      (olympic) => new OlympicListedBaseDto(olympic),
    );
  }

  async findMy(filter: GetMyOlympicsFilter, currentUser: User) {
    return Paginate<Prisma.OlympiadFindManyArgs>(
      OlympicListedMyDto,
      {
        page: filter.page,
        limit: filter.limit,
      },
      this.prisma,
      'olympiad',
      {
        where: {
          tags: {
            some: {
              name: {
                in: filter.tags,
              },
            },
          },
          grade: {
            equals: filter.grade,
          },
          steps: {
            some: {
              step: {
                equals: filter.step,
              },
            },
          },
          applications: {
            some: {
              student: {
                id: currentUser.id,
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        ...this.olympicWithStepsInclude,
      },
      (olympic) => new OlympicListedMyDto(olympic),
    );
  }

  async update(
    searchDetails: Prisma.OlympiadWhereUniqueInput,
    details: OlympicUpdateDto,
  ): Promise<OlympicDto> {
    const { steps, tags, image, ...rest } = details;
    await this.findOneOrThrowError(searchDetails);
    const imageLink = image ? await this.imageService.save(image) : undefined;
    const result = await this.prisma.olympiad.update({
      where: searchDetails,
      data: {
        ...rest,
        imageLink,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              name: tag.name,
            },
            create: tag,
          })),
        },
        steps: steps
          ? {
              deleteMany: {
                olympiadId: searchDetails.id,
              },
              create: steps,
            }
          : undefined,
      },
      ...this.olympicsBaseIncludes,
    });
    return new OlympicDto(result);
  }

  async findOneOrThrowError(
    searchDetails: Prisma.OlympiadWhereUniqueInput,
  ): Promise<OlympicDto> {
    const result = await this.prisma.olympiad.findUnique({
      where: searchDetails,
      ...this.olympicsBaseIncludes,
    });
    if (!result) {
      throw new OlympicNotFoundException(searchDetails.id);
    }
    return new OlympicDto(result);
  }

  async delete(searchDetails: Prisma.OlympiadWhereUniqueInput): Promise<void> {
    await this.findOneOrThrowError(searchDetails);
    await this.prisma.olympiad.delete({ where: searchDetails });
  }

  async userAttended(olympicsId: number, userId: number): Promise<boolean> {
    const olympic = await this.prisma.olympiad.findFirst({
      where: {
        id: olympicsId,
        studentsAttended: {
          some: {
            id: userId,
          },
        },
      },
    });
    return !!olympic;
  }

  async updateRating(olympicId: number): Promise<void> {
    const reviews = await this.prisma.olympiadReview.findMany({
      where: {
        olympiadId: olympicId,
        status: PublishingStatus.PUBLISHED,
      },
    });
    if (reviews.length === 0) {
      return;
    }
    const rating = reviews.reduce((acc, review) => acc + review.rating, 0);
    await this.prisma.olympiad.update({
      where: {
        id: olympicId,
      },
      data: {
        rating: rating / reviews.length,
      },
    });
  }
}
