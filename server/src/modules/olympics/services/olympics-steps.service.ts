import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { OlympicStepDto } from '@olympics/dto/response';
import { FindOlympicStepParams } from '@olympics/params';
import {
  OlympicStepFinishedException,
  OlympicStepNotAttendedException,
  OlympicStepNotFoundException,
  OlympicStepNotStartedException,
} from '@olympics/exceptions';

@Injectable()
export class OlympicsStepsService {
  constructor(private readonly prisma: PrismaService) {}

  async stepsExist(olympicsId: number, ids: Array<number>): Promise<boolean> {
    const steps = await this.prisma.olympiadStep.findMany({
      where: {
        olympiadId: olympicsId,
        id: {
          in: ids,
        },
      },
    });
    return steps.length === ids.length;
  }

  async findOneAndValidateIfInProgress(
    searchDetails: FindOlympicStepParams,
    currentUser: User,
  ): Promise<OlympicStepDto> {
    const step = await this.findOneAttendedOrThrowError(
      searchDetails,
      currentUser,
    );
    if (step.startDate > new Date()) {
      throw new OlympicStepNotStartedException(searchDetails.stepId);
    }
    if (step.finishDate < new Date()) {
      throw new OlympicStepFinishedException(searchDetails.stepId);
    }
    return step;
  }

  async findOneOrThrowError(
    searchDetails: FindOlympicStepParams,
  ): Promise<OlympicStepDto> {
    const step = await this.prisma.olympiadStep.findFirst({
      where: {
        id: searchDetails.stepId,
        olympiadId: searchDetails.olympicsId,
      },
    });
    if (!step) {
      throw new OlympicStepNotFoundException(searchDetails.stepId);
    }
    return new OlympicStepDto(step);
  }

  async findOneAttendedOrThrowError(
    searchDetails: FindOlympicStepParams,
    currentUser: User,
  ): Promise<OlympicStepDto> {
    const step = await this.prisma.olympiadStep.findFirst({
      where: {
        id: searchDetails.stepId,
        olympiadId: searchDetails.olympicsId,
      },
      include: {
        applications: {
          include: {
            student: true,
          },
        },
      },
    });
    if (!step) {
      throw new OlympicStepNotFoundException(searchDetails.stepId);
    }
    if (
      !step.applications.some(
        (application) => application.studentId === currentUser.id,
      )
    ) {
      throw new OlympicStepNotAttendedException(searchDetails.stepId);
    }
    return new OlympicStepDto(step);
  }
}
