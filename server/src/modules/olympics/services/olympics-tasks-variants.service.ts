import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import {
  FindOlympicTaskParams,
  FindOlympicTaskVariantParams,
} from '@olympics/params';
import {
  OlympicTaskAnswerVariantCreateDto,
  OlympicTaskAnswerVariantUpdateDto,
} from '@olympics/dto/request';
import { OlympicTaskAnswerVariantFullDto } from '@olympics/dto/response';
import { OlympicsTasksService } from '@olympics/services/olympics-tasks.service';
import { OlympicTaskAnswerVariantNotFoundException } from '@olympics/exceptions';

@Injectable()
export class OlympicsTasksVariantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly olympicsTasksService: OlympicsTasksService,
  ) {}

  async create(
    searchDetails: FindOlympicTaskParams,
    details: OlympicTaskAnswerVariantCreateDto,
  ): Promise<OlympicTaskAnswerVariantFullDto> {
    await this.olympicsTasksService.findOneOrThrowError(searchDetails);
    const variant = await this.prisma.olympiadTaskAnswerVariant.create({
      data: {
        ...details,
        olympiadTask: {
          connect: {
            id: searchDetails.taskId,
          },
        },
      },
    });
    return new OlympicTaskAnswerVariantFullDto(variant);
  }

  async findOneOrThrowError(
    searchDetails: FindOlympicTaskVariantParams,
  ): Promise<OlympicTaskAnswerVariantFullDto> {
    const variant = await this.prisma.olympiadTaskAnswerVariant.findFirst({
      where: {
        olympiadTaskId: searchDetails.taskId,
        id: searchDetails.id,
      },
    });

    if (!variant) {
      throw new OlympicTaskAnswerVariantNotFoundException(searchDetails.id);
    }

    return new OlympicTaskAnswerVariantFullDto(variant);
  }

  async update(
    searchDetails: FindOlympicTaskVariantParams,
    details: OlympicTaskAnswerVariantUpdateDto,
  ): Promise<OlympicTaskAnswerVariantFullDto> {
    const variant = await this.findOneOrThrowError(searchDetails);
    const updatedVariant = await this.prisma.olympiadTaskAnswerVariant.update({
      where: {
        id: variant.id,
      },
      data: details,
    });
    return new OlympicTaskAnswerVariantFullDto(updatedVariant);
  }

  async delete(searchDetails: FindOlympicTaskVariantParams): Promise<void> {
    const variant = await this.findOneOrThrowError(searchDetails);
    await this.prisma.olympiadTaskAnswerVariant.delete({
      where: {
        id: variant.id,
      },
    });
  }
}
