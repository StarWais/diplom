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

import { CoursesAttendancesService } from '../services';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';
import { CurrentUser } from '@common/decorators';
import {
  CourseAttendanceCreateDto,
  CourseAttendanceUpdateDto,
} from '../dto/request';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { CourseAttendanceDto } from '../dto/response';
import { FindByCourseIdParams, FindCourseAttendanceParams } from '../params';
import { GetCoursesAttendancesFilter } from '../filters';

@ApiTags('Посещаемость курсов')
@Controller('courses/:courseId/attendances')
export class CoursesAttendancesController {
  constructor(
    private readonly coursesAttendancesService: CoursesAttendancesService,
  ) {}

  @ApiOperation({
    summary: 'Получить студенту свою посещаемость курса',
    description: 'Доступно только студенту',
  })
  @ApiPaginatedResponse(CourseAttendanceDto)
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my')
  async findMy(
    @Param() searchParams: FindByCourseIdParams,
    @Query() filter: GetCoursesAttendancesFilter,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedDto<CourseAttendanceDto>> {
    return this.coursesAttendancesService.findMany(
      searchParams,
      filter,
      currentUser,
      true,
    );
  }

  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Получить полную посещаесость курса',
    description: 'Доступно только преподавателю и администратору',
  })
  @ApiPaginatedResponse(CourseAttendanceDto)
  @ApiBearerAuth()
  @Get()
  async findMany(
    @Param() searchParams: FindByCourseIdParams,
    @Query() filter: GetCoursesAttendancesFilter,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedDto<CourseAttendanceDto>> {
    return this.coursesAttendancesService.findMany(
      searchParams,
      filter,
      currentUser,
    );
  }

  @ApiOperation({
    summary: 'Добавить посещаемость к курсу',
    description: 'Доступно только преподавателю',
  })
  @ApiCreatedResponse({
    type: CourseAttendanceDto,
    description: 'Добавленная посещаемость',
  })
  @ApiBearerAuth()
  @Roles(Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Param() searchParams: FindByCourseIdParams,
    @Body() details: CourseAttendanceCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<CourseAttendanceDto> {
    return this.coursesAttendancesService.create(
      searchParams,
      details,
      currentUser,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Получить посещаемость курса',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    type: CourseAttendanceDto,
    description: 'Посещаемость курса',
  })
  @Get(':id')
  @ApiBearerAuth()
  async findOne(
    @Param() searchParams: FindCourseAttendanceParams,
  ): Promise<CourseAttendanceDto> {
    return this.coursesAttendancesService.findOneOrThrowError(searchParams);
  }

  @ApiOperation({
    summary: 'Обновить посещаемость к курсу',
    description: 'Доступно только преподавателю',
  })
  @ApiBearerAuth()
  @Roles(Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CourseAttendanceDto,
    description: 'Обновленная посещаемость',
  })
  @Patch(':id')
  async update(
    @Param() searchParams: FindCourseAttendanceParams,
    @Body() details: CourseAttendanceUpdateDto,
    @CurrentUser() currentUser: User,
  ): Promise<CourseAttendanceDto> {
    return this.coursesAttendancesService.update(
      searchParams,
      details,
      currentUser,
    );
  }
  @ApiOperation({
    summary: 'Удалить посещаемость к курсу',
    description: 'Доступно только преподавателю',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'Посещаемость удалена',
  })
  @Roles(Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(
    @Param() searchParams: FindCourseAttendanceParams,
    @CurrentUser() currentUser: User,
  ): Promise<void> {
    return this.coursesAttendancesService.delete(searchParams, currentUser);
  }
}
