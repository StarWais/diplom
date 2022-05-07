import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { OlympicsBaseIncludes } from '../interfaces';
import { OlympicCreateDto, OlympicUpdateDto } from '../dto/request';
import { OlympicDto } from '../dto/response';
import { OlympicNotFoundException } from '../exceptions';
import { ImagesService } from '../../images/images.service';

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

  async create(details: OlympicCreateDto): Promise<OlympicDto> {
    const { steps, tags, image, ...rest } = details;
    const imageLink = await this.imageService.saveImage(image);
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

  async update(
    searchDetails: Prisma.OlympiadWhereUniqueInput,
    details: OlympicUpdateDto,
  ): Promise<OlympicDto> {
    const { steps, tags, image, ...rest } = details;
    const imageLink = image
      ? await this.imageService.saveImage(image)
      : undefined;
    await this.findOneOrThrowError(searchDetails);
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
}
