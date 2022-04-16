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
import { FindOneParams } from '../common/params/find-one-params';
import { CoursesService } from './courses.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import {
  CourseUpdateDto,
  CourseApplicationCreateDto,
  CourseApplicationUpdateDto,
  CourseCreateDto,
  CreateCourseReviewDto,
} from './dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { PaginationQuery } from '../common/pagination/pagination-query';
import { FormDataRequest } from 'nestjs-form-data';
import { GetCoursesFilter } from '../common/filters/get-courses.filter';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({
    summary: 'Получить список всех курсов',
  })
  @Get()
  async findAll(@Query() filter: GetCoursesFilter) {
    return this.coursesService.findAll(filter);
  }

  @ApiOperation({
    summary: 'Получить мои курсы',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyCourses(@CurrentUser() currentUser: User) {
    return this.coursesService.findMyCourses(currentUser);
  }

  @ApiOperation({
    summary: 'Получить список тегов курсов',
  })
  @Get('tags')
  async tags() {
    return this.coursesService.tags();
  }

  @ApiOperation({
    summary: 'Получить курс по id',
  })
  @Get(':id')
  async findOne(@Param() searchParams: FindOneParams) {
    return this.coursesService.findCourseOrThrowError(searchParams);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Создать курс',
  })
  @FormDataRequest()
  @Post()
  async create(@Body() details: CourseCreateDto) {
    return this.coursesService.create(details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Обновить курс',
  })
  @FormDataRequest()
  @Patch(':id')
  async update(
    @Param() searchParams: FindOneParams,
    @Body() details: CourseUpdateDto,
  ) {
    return this.coursesService.update(searchParams, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удалить курс',
  })
  @Delete(':id')
  async delete(@Param() searchParams: FindOneParams) {
    return this.coursesService.delete(searchParams);
  }

  @ApiOperation({
    summary: 'Получить отзывы к курсу',
  })
  @Get(':id/reviews')
  async reviews(
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
  async createReview(
    @Param() searchParams: FindOneParams,
    @Body() details: CreateCourseReviewDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.coursesService.createReview(searchParams, details, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Опубликовать отзыв',
  })
  @Post('reviews/:id/publish')
  async publishReview(@Param() searchParams: FindOneParams) {
    return this.coursesService.publishReview(searchParams.id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить отзыв',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('reviews/:id')
  async deleteReview(@Param() searchParams: FindOneParams) {
    await this.coursesService.deleteReview(searchParams);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить список заявок на курс',
  })
  @Get('/:id/applications')
  async findApplications(
    @Param() findDetails: FindOneParams,
    @Query() filter: PaginationQuery,
  ) {
    return this.coursesService.findApplications(findDetails, filter);
  }

  @ApiOperation({
    summary: 'Записаться на курс',
  })
  @Post('/:id/applications')
  @HttpCode(HttpStatus.CREATED)
  async apply(
    @Param() { id }: FindOneParams,
    @Body() details: CourseApplicationCreateDto,
  ) {
    return this.coursesService.applyToCourse(id, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить заявку на курс',
  })
  @Patch('applications/:id/')
  async updateApplication(
    @Param() { id }: FindOneParams,
    @Body() details: CourseApplicationUpdateDto,
  ) {
    return this.coursesService.updateApplication(id, details);
  }
}
