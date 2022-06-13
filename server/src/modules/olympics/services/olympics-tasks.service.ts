import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';

import { FindOlympicStepParams, FindOlympicTaskParams } from '@olympics/params';
import { OlympicTaskDto, OlympicTaskFullDto } from '@olympics/dto/response';
import { OlympicTaskInclude } from '@olympics/interfaces';
import {
  OlympicTaskNotFoundException,
  TasksNotInRangeException,
  TaskVariantNotInRangeException,
} from '@olympics/exceptions';
import {
  OlympicStepAttemptCreateDto,
  OlympicTaskCreateDto,
  OlympicTaskUpdateDto,
} from '@olympics/dto/request';
import { OlympicsStepsService } from '@olympics/services/olympics-steps.service';
import { PaginationQuery } from '@pagination/pagination-query';
import { Paginate, PaginatedDto } from '@pagination/pagination';

@Injectable()
export class OlympicsTasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly olympicsStepsService: OlympicsStepsService,
  ) {}

  readonly olympicTaskInclude: OlympicTaskInclude = {
    include: {
      variants: true,
    },
  };

  async findOneOrThrowError(
    searchDetails: FindOlympicTaskParams,
  ): Promise<OlympicTaskFullDto> {
    const task = await this.prisma.olympiadTask.findFirst({
      where: {
        olympiadStepId: searchDetails.stepId,
        id: searchDetails.taskId,
      },
      ...this.olympicTaskInclude,
    });

    if (!task) {
      throw new OlympicTaskNotFoundException(searchDetails.taskId);
    }

    return new OlympicTaskFullDto(task);
  }

  async validateTasks(
    attempts: OlympicStepAttemptCreateDto,
    stepId: number,
  ): Promise<void> {
    const tasksInStep = await this.prisma.olympiadTask.findMany({
      where: {
        olympiadStepId: stepId,
      },
    });

    const taskIds = tasksInStep.map((task) => task.id);
    const dtoTaskIds = attempts.taskAttempts.map((attempt) => attempt.taskId);

    const invalidTaskIds = dtoTaskIds.filter(
      (taskId) => !taskIds.includes(taskId),
    );

    if (invalidTaskIds.length) {
      throw new TasksNotInRangeException(invalidTaskIds, stepId);
    }

    const answeredTasks = await this.prisma.olympiadTask.findMany({
      where: {
        id: {
          in: taskIds,
        },
      },
      include: {
        variants: true,
      },
    });

    answeredTasks.forEach((task) => {
      const dtoAttempt = attempts.taskAttempts.find(
        (attempt) => attempt.taskId === task.id,
      );
      const dtoAttemptVariantsIds = dtoAttempt.variants;
      const taskVariantsIds = task.variants.map((variant) => variant.id);
      dtoAttemptVariantsIds.forEach((variant) => {
        if (!taskVariantsIds.includes(variant)) {
          throw new TaskVariantNotInRangeException(variant, task.id);
        }
      });
    });
  }

  async create(
    searchDetails: FindOlympicStepParams,
    details: OlympicTaskCreateDto,
  ): Promise<OlympicTaskFullDto> {
    await this.olympicsStepsService.findOneOrThrowError(searchDetails);
    const task = await this.prisma.olympiadTask.create({
      data: {
        ...details,
        olympiadStep: {
          connect: {
            id: searchDetails.stepId,
          },
        },
      },
      ...this.olympicTaskInclude,
    });
    return new OlympicTaskFullDto(task);
  }

  async update(
    searchDetails: FindOlympicTaskParams,
    details: OlympicTaskUpdateDto,
  ): Promise<OlympicTaskFullDto> {
    await this.findOneOrThrowError(searchDetails);
    const task = await this.prisma.olympiadTask.update({
      where: {
        id: searchDetails.taskId,
      },
      data: details,
    });

    return new OlympicTaskFullDto(task);
  }

  async delete(searchDetails: FindOlympicTaskParams): Promise<void> {
    await this.findOneOrThrowError(searchDetails);
    await this.prisma.olympiadTask.delete({
      where: {
        id: searchDetails.taskId,
      },
    });
  }

  async findFull(
    searchDetails: FindOlympicStepParams,
    paginationDetails: PaginationQuery,
  ): Promise<PaginatedDto<OlympicTaskFullDto>> {
    return Paginate<Prisma.OlympiadTaskFindManyArgs>(
      OlympicTaskFullDto,
      paginationDetails,
      this.prisma,
      'olympiadTask',
      {
        where: {
          olympiadStepId: searchDetails.stepId,
        },
        ...this.olympicTaskInclude,
      },
      (task) => new OlympicTaskFullDto(task),
    );
  }

  async findMany(
    searchDetails: FindOlympicStepParams,
    paginationDetails: PaginationQuery,
    currentUser: User,
  ): Promise<PaginatedDto<OlympicTaskDto>> {
    await this.olympicsStepsService.findOneAndValidateIfInProgress(
      searchDetails,
      currentUser,
    );
    return Paginate<Prisma.OlympiadTaskFindManyArgs>(
      OlympicTaskDto,
      paginationDetails,
      this.prisma,
      'olympiadTask',
      {
        where: {
          olympiadStepId: searchDetails.stepId,
        },
        ...this.olympicTaskInclude,
      },
      (task) => new OlympicTaskDto(task),
    );
  }
}
