import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesApplicationsService } from '../services';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PaginationQuery } from '../../../common/pagination/pagination-query';
import {
  CourseApplicationCreateDto,
  CourseApplicationUpdateDto,
} from '../dto/request';
import { FindByCourseIdParams, FindCourseApplicationParams } from '../params';
import { CourseApplicationDto } from '../dto/response';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';

@ApiTags('Заявки на курсы')
@ApiExtraModels(PaginatedDto)
@Controller('courses/:courseId/applications')
export class CoursesApplicationsController {
  constructor(
    private readonly coursesApplicationsService: CoursesApplicationsService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список заявок на курс',
    description: 'Доступно только администратору',
  })
  @ApiPaginatedResponse(CourseApplicationDto)
  @Get()
  async findMany(
    @Param() searchParams: FindByCourseIdParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<CourseApplicationDto>> {
    return this.coursesApplicationsService.findMany(searchParams, filter);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить заявку на курс',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({ type: CourseApplicationDto, description: 'Заявка на курс' })
  @Get()
  async findOne(
    @Param() searchParams: FindCourseApplicationParams,
  ): Promise<CourseApplicationDto> {
    return this.coursesApplicationsService.findOneOrThrowError(searchParams);
  }

  @ApiOperation({
    summary: 'Записаться на курс',
  })
  @Post()
  @ApiCreatedResponse({
    type: CourseApplicationDto,
    description: 'Заявка на курс',
  })
  async create(
    @Param() searchParams: FindByCourseIdParams,
    @Body() details: CourseApplicationCreateDto,
  ): Promise<CourseApplicationDto> {
    return this.coursesApplicationsService.create(searchParams, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить заявку на курс',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    type: CourseApplicationDto,
    description: 'Обновленная заявка на курс',
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param() searchParams: FindCourseApplicationParams,
    @Body() details: CourseApplicationUpdateDto,
  ) {
    return this.coursesApplicationsService.update(searchParams, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить заявку на курс',
    description: 'Доступно только администратору',
  })
  @ApiNoContentResponse({
    description: 'Заявка на курс удалена',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(
    @Param() searchParams: FindCourseApplicationParams,
  ): Promise<void> {
    await this.coursesApplicationsService.delete(searchParams);
  }
}
