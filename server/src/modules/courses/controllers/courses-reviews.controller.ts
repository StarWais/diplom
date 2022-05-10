import { CoursesReviewsService } from '../services';
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CourseReviewCreateDto, CourseReviewUpdateDto } from '../dto/request';
import { CurrentUser } from '../../../common/decorators';
import { FindByCourseIdParams, FindCourseReviewParams } from '../params';
import { CourseReviewDto } from '../dto/response';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';

@ApiTags('Отзывы к курсам')
@Controller('courses/:courseId/reviews')
export class CoursesReviewsController {
  constructor(private readonly coursesReviewsService: CoursesReviewsService) {}

  @ApiOperation({
    summary: 'Получить опубликованные отзывы к курсу',
  })
  @ApiPaginatedResponse(CourseReviewDto)
  @Get('published')
  async findPublished(
    @Param() searchParams: FindByCourseIdParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<CourseReviewDto>> {
    return this.coursesReviewsService.findMany(searchParams, filter);
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiOperation({
    summary: 'Получить все отзывы к курсу',
    description: 'Доступно только администратору',
  })
  @ApiPaginatedResponse(CourseReviewDto)
  async findMany(
    @Param() searchParams: FindByCourseIdParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<CourseReviewDto>> {
    return this.coursesReviewsService.findMany(searchParams, filter, true);
  }

  @ApiOperation({
    summary: 'Получить отзыв к курсу',
  })
  @ApiOkResponse({ type: CourseReviewDto })
  @Get(':id')
  async findOne(
    @Param() searchParams: FindCourseReviewParams,
  ): Promise<CourseReviewDto> {
    return this.coursesReviewsService.findOneOrThrowError(searchParams);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Оставить отзыв к курсу',
    description: 'Доступно только студентам',
  })
  @ApiCreatedResponse({
    description: 'Отзыв к курсу успешно добавлен',
    type: CourseReviewDto,
  })
  async create(
    @Param() searchParams: FindByCourseIdParams,
    @Body() details: CourseReviewCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<CourseReviewDto> {
    return this.coursesReviewsService.create(
      searchParams,
      details,
      currentUser,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CourseReviewDto,
    description: 'Обновленный отзыв к курсу',
  })
  @ApiOperation({
    summary: 'Обновить отзыв',
    description: 'Доступно только администратору',
  })
  @Patch(':id')
  async update(
    @Param() searchParams: FindCourseReviewParams,
    @Body() details: CourseReviewUpdateDto,
  ): Promise<CourseReviewDto> {
    return this.coursesReviewsService.update(searchParams, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить отзыв',
    description: 'Доступно только администратору',
  })
  @ApiNoContentResponse({
    description: 'Отзыв удален',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() searchParams: FindCourseReviewParams): Promise<void> {
    await this.coursesReviewsService.delete(searchParams);
  }
}
