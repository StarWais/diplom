import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import {
  FindOlympicStepAttemptParams,
  FindOlympicStepParams,
} from '@olympics/params';
import { OlympicsStepsService } from '@olympics/services/olympics-steps.service';
import {
  OlympicStepAttemptCreatedException,
  OlympicStepAttemptNotFoundException,
} from '@olympics/exceptions';
import { OlympicStepAttemptCreateDto } from '@olympics/dto/request';
import { OlympicsTasksService } from '@olympics/services/olympics-tasks.service';
import { OlympicStepAttemptDto } from '@olympics/dto/response';
import { PaginationQuery } from '@pagination/pagination-query';
import { Paginate, PaginatedDto } from '@pagination/pagination';

@Injectable()
export class OlympicsStepAttemptsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly olympicStepsService: OlympicsStepsService,
    private readonly olympicTasksService: OlympicsTasksService,
  ) {}

  async stepCreated(
    searchParams: FindOlympicStepParams,
    user: User,
  ): Promise<boolean> {
    const step = await this.prisma.olympiadStepAttempt.findFirst({
      where: {
        olympiadStepId: searchParams.stepId,
        studentId: user.id,
      },
    });
    return !!step;
  }

  async findOneOrThrowError(
    searchParams: FindOlympicStepAttemptParams,
  ): Promise<OlympicStepAttemptDto> {
    const attempt = await this.prisma.olympiadStepAttempt.findFirst({
      where: {
        olympiadStepId: searchParams.stepId,
        id: searchParams.id,
      },
    });
    if (!attempt) {
      throw new OlympicStepAttemptNotFoundException(searchParams.id);
    }
    return new OlympicStepAttemptDto(attempt);
  }

  async findMany(
    paginationDetails: PaginationQuery,
    searchParams: FindOlympicStepAttemptParams,
  ): Promise<PaginatedDto<OlympicStepAttemptDto>> {
    return Paginate<Prisma.OlympiadStepAttemptFindManyArgs>(
      OlympicStepAttemptDto,
      paginationDetails,
      this.prisma,
      'olympiadStepAttempt',
      {
        where: {
          olympiadStepId: searchParams.stepId,
        },
      },
      (attempt) => new OlympicStepAttemptDto(attempt),
    );
  }

  async create(
    searchParams: FindOlympicStepParams,
    details: OlympicStepAttemptCreateDto,
    user: User,
  ): Promise<void> {
    await this.olympicStepsService.findOneAndValidateIfInProgress(
      searchParams,
      user,
    );
    const stepCreated = await this.stepCreated(searchParams, user);
    if (stepCreated) {
      throw new OlympicStepAttemptCreatedException(searchParams.stepId);
    }

    await this.olympicTasksService.validateTasks(details, searchParams.stepId);
    await this.prisma.olympiadStepAttempt.create({
      data: {
        olympiadStep: {
          connect: {
            id: searchParams.stepId,
          },
        },
        student: {
          connect: {
            id: user.id,
          },
        },
        attempts: {
          create: details.taskAttempts.map((attempt) => ({
            student: {
              connect: {
                id: user.id,
              },
            },
            olympiadTask: {
              connect: {
                id: attempt.taskId,
              },
            },
            answers: {
              connect: attempt.variants.map((answer) => ({
                id: answer,
              })),
            },
          })),
        },
      },
    });
  }
}
