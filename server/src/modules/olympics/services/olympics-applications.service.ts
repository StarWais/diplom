import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { OlympicsService } from './olympics-service';
import { OlympicApplicationCreateDto } from '../dto/request';
import { User } from '@prisma/client';
import {
  FindByOlympicsIdParams,
  FindOlympicsApplicationParams,
} from '../params';
import { OlympicsStepsService } from './olympics-steps.service';
import {
  OlympicApplicationNotFoundException,
  OlympicsStepsInvalidException,
  StudentAlreadyAppliedException,
} from '../exceptions';
import { OlympicsApplicationInclude } from '../interfaces';
import { OlympicApplicationDto } from '../dto/response';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';

@Injectable()
export class OlympicsApplicationsService {
  private readonly olympicApplicationInclude: OlympicsApplicationInclude = {
    include: {
      olympiad: true,
      student: true,
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly olympicsService: OlympicsService,
    private readonly olympicsStepsService: OlympicsStepsService,
  ) {}

  async findOneOrThrowError(
    searchParams: FindOlympicsApplicationParams,
  ): Promise<OlympicApplicationDto> {
    const result = await this.prisma.olympiadApplication.findFirst({
      where: {
        id: searchParams.id,
        olympiadId: searchParams.olympicsId,
      },
      ...this.olympicApplicationInclude,
    });
    if (!result) {
      throw new OlympicApplicationNotFoundException(searchParams.id);
    }
    return new OlympicApplicationDto(result);
  }

  async findMany(
    searchParams: FindByOlympicsIdParams,
    paginationDetails: PaginationQuery,
  ): Promise<PaginatedDto<OlympicApplicationDto>> {
    return Paginate(
      OlympicApplicationDto,
      {
        page: paginationDetails.page,
        limit: paginationDetails.limit,
      },
      this.prisma,
      'olympiadApplication',
      {
        where: {
          olympiadId: searchParams.olympicsId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...this.olympicApplicationInclude,
      },
      (olympicsApplication) => new OlympicApplicationDto(olympicsApplication),
    );
  }

  async studentAlreadyApplied(
    studentId: number,
    stepIds: Array<number>,
  ): Promise<boolean> {
    const applications = await this.prisma.olympiadApplication.findMany({
      where: {
        student: {
          id: studentId,
        },
        steps: {
          some: {
            id: {
              in: stepIds,
            },
          },
        },
      },
    });
    return applications.length > 0;
  }

  async create(
    searchParams: FindByOlympicsIdParams,
    details: OlympicApplicationCreateDto,
    currentUser: User,
  ): Promise<void> {
    const { olympicsId } = searchParams;
    const { stepIds } = details;
    await this.olympicsService.findOneOrThrowError({
      id: olympicsId,
    });
    const idsInRange = await this.olympicsStepsService.stepsExist(
      olympicsId,
      stepIds,
    );
    if (!idsInRange) {
      throw new OlympicsStepsInvalidException();
    }
    const studentAlreadyApplied = await this.studentAlreadyApplied(
      currentUser.id,
      stepIds,
    );
    if (studentAlreadyApplied) {
      throw new StudentAlreadyAppliedException();
    }
    await this.prisma.olympiadApplication.create({
      data: {
        olympiad: { connect: { id: olympicsId } },
        steps: { connect: stepIds.map((id) => ({ id })) },
        student: { connect: { id: currentUser.id } },
      },
    });
  }

  async delete(searchParams: FindOlympicsApplicationParams): Promise<void> {
    await this.findOneOrThrowError(searchParams);
    await this.prisma.olympiadApplication.delete({
      where: searchParams,
    });
  }
}