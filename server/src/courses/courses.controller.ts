import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindOneParams } from '../common/params/find-one-params';
import { CoursesService } from './courses.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoursesGetFilter } from './filters';
import { CourseCreateDto } from './dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CourseUpdateDto } from './dto/course-update.dto';
import { CreateCourseReviewDto } from './dto/create-course-review.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { PaginationQuery } from '../common/pagination/pagination-query';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({
    summary: 'Получить список всех курсов',
  })
  @Get()
  findAll(@Query() filter: CoursesGetFilter) {
    return this.coursesService.findAll(filter);
  }

  @ApiOperation({
    summary: 'Получить список тегов курсов',
  })
  @Get('tags')
  tags() {
    return this.coursesService.tags();
  }

  @ApiOperation({
    summary: 'Получить курс по id',
  })
  @Get(':id')
  findOne(@Param() searchParams: FindOneParams) {
    return this.coursesService.findCourseOrThrowError(searchParams);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать курс',
  })
  @Post()
  create(@Body() details: CourseCreateDto) {
    return this.coursesService.create(details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить курс',
  })
  @Patch(':id')
  update(
    @Param() searchParams: FindOneParams,
    @Body() details: CourseUpdateDto,
  ) {
    return this.coursesService.update(searchParams, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить курс',
  })
  @Delete(':id')
  delete(@Param() searchParams: FindOneParams) {
    return this.coursesService.delete(searchParams);
  }

  @ApiOperation({
    summary: 'Получить отзывы к курсу',
  })
  @Get(':id/reviews')
  reviews(
    @Param() searchParams: FindOneParams,
    @Query() filter: PaginationQuery,
  ) {
    return this.coursesService.findReviews(searchParams, filter);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Оставить отзыв',
  })
  @Post(':id/reviews')
  createReview(
    @Param() searchParams: FindOneParams,
    @Body() details: CreateCourseReviewDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.coursesService.createReview(searchParams, details, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить отзыв',
  })
  @Delete('reviews/:id')
  deleteReview(@Param() searchParams: FindOneParams) {
    return this.coursesService.deleteReview(searchParams);
  }
}
