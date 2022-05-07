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
import { Role, User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { FindOneByIDParams } from '../../common/params/find-one-by-id-params';
import { CoursesService } from './courses.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import {
  CourseApplicationCreateDto,
  CourseApplicationUpdateDto,
  CourseAttendanceCreateDto,
  CourseAttendanceUpdateDto,
  CourseCreateDto,
  CourseUpdateDto,
  CreateCourseReviewDto,
} from './dto/request';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQuery } from '../../common/pagination/pagination-query';
import { GetByTagsAndGradeFilter } from '../../common/filters/get-by-tags-and-grade.filter';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({
    summary: 'Получить список всех курсов',
  })
  @Get()
  async findAll(@Query() filter: GetByTagsAndGradeFilter) {
    return this.coursesService.findAll(filter);
  }

  @ApiOperation({
    summary: 'Получить 6 самых популярных курсов',
  })
  @Get('top-rated')
  async findTopRated() {
    return this.coursesService.findTopRated();
  }

  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({
    summary: 'Получить мои курсы (студент)',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('attending')
  async findMyAttendingCourses(@CurrentUser() currentUser: User) {
    return this.coursesService.findMyStudentsCourses(currentUser);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Получить мои курсы (учитель)',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('teaching')
  async findMyTeachingCourses(@CurrentUser() currentUser: User) {
    return this.coursesService.findMyTeachersCourses(currentUser);
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
  async findOne(@Param() searchParams: FindOneByIDParams) {
    return this.coursesService.findCourseOrThrowError(searchParams);
  }

  @ApiOperation({
    summary: 'Получить студенту свою посещаемость курса',
  })
  @ApiBearerAuth()
  @Roles(Role.STUDENT, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/my-attendance')
  async getMyAttendanceToCourse(
    @Param() searchParams: FindOneByIDParams,
    @CurrentUser() currentUser: User,
  ) {
    return this.coursesService.getStudentCourseAttendance(
      searchParams,
      currentUser,
    );
  }

  @ApiOperation({
    summary: 'Получить полную посещаесость курса',
  })
  @ApiBearerAuth()
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/attendance')
  async getAttendances(
    @Param() searchParams: FindOneByIDParams,
    @CurrentUser() currentUser: User,
  ) {
    return this.coursesService.getFullCourseAttendance(
      searchParams,
      currentUser,
    );
  }

  @ApiOperation({
    summary: 'Добавить посещаемость к курсу',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/attendance')
  async createAttendance(
    @Param() searchParams: FindOneByIDParams,
    @Body() details: CourseAttendanceCreateDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.coursesService.createCourseAttendance(
      searchParams,
      details,
      currentUser,
    );
  }

  @ApiOperation({
    summary: 'Обновить посещаемость к курсу',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('attendance/:id')
  async updateAttendance(
    @Param() searchParams: FindOneByIDParams,
    @Body() details: CourseAttendanceUpdateDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.coursesService.updateCourseAttendance(
      searchParams,
      details,
      currentUser,
    );
  }
  @ApiOperation({
    summary: 'Удалить посещаемость к курсу',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('attendance/:id')
  async deleteAttendance(@Param() searchParams: FindOneByIDParams) {
    return this.coursesService.deleteCourseAttendance(searchParams);
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
    @Param() searchParams: FindOneByIDParams,
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
  async delete(@Param() searchParams: FindOneByIDParams) {
    return this.coursesService.delete(searchParams);
  }

  @ApiOperation({
    summary: 'Получить отзывы к курсу',
  })
  @Get(':id/reviews')
  async reviews(
    @Param() searchParams: FindOneByIDParams,
    @Query() filter: PaginationQuery,
  ) {
    return this.coursesService.findReviews(searchParams, filter);
  }

  @Roles(Role.ADMIN, Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Оставить отзыв',
  })
  @Post(':id/reviews')
  async createReview(
    @Param() searchParams: FindOneByIDParams,
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
  async publishReview(@Param() searchParams: FindOneByIDParams) {
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
  async deleteReview(@Param() searchParams: FindOneByIDParams) {
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
    @Param() findDetails: FindOneByIDParams,
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
    @Param() { id }: FindOneByIDParams,
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
    @Param() { id }: FindOneByIDParams,
    @Body() details: CourseApplicationUpdateDto,
  ) {
    return this.coursesService.updateApplication(id, details);
  }
}