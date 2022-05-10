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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { FindOneByIDParams } from '../../../common/params';
import { CoursesService } from '../services';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CourseCreateDto, CourseUpdateDto } from '../dto/request';
import { CurrentUser } from '../../../common/decorators';
import { GetByTagsAndGradeFilter } from '../../../common/filters';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';
import {
  CourseDto,
  CourseListedDto,
  CourseListedPersonalStudentDto,
  CourseListedPersonalTeacherDto,
  CourseTagDto,
} from '../dto/response';
import { GetPersonalCoursesFilter } from '../filters';
import { BasicUserNameDto } from '../../users/dto/response';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({
    summary: 'Получить список всех курсов',
  })
  @ApiPaginatedResponse(CourseListedDto)
  @Get()
  async findMany(
    @Query() filter: GetByTagsAndGradeFilter,
  ): Promise<PaginatedDto<CourseListedDto>> {
    return this.coursesService.findMany(filter);
  }

  @ApiOperation({
    summary: 'Получить 6 самых популярных курсов',
  })
  @ApiOkResponse({
    type: CourseListedDto,
    isArray: true,
    description: '6 самых популярных курсов',
  })
  @Get('top-rated')
  async topRated(): Promise<Array<CourseListedDto>> {
    return this.coursesService.findTopRated();
  }

  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: 'Получить мои курсы (студент)',
    description: 'Доступно только студентам',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiPaginatedResponse(CourseListedPersonalStudentDto)
  @Get('attending')
  async findAttending(
    @Query() filter: GetPersonalCoursesFilter,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedDto<CourseListedPersonalStudentDto>> {
    return this.coursesService.findAttending(filter, currentUser);
  }

  @Roles(Role.TEACHER)
  @ApiOperation({
    summary: 'Получить мои курсы (учитель)',
    description: 'Доступно только учителям',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiPaginatedResponse(CourseListedPersonalTeacherDto)
  @Get('teaching')
  async findTeaching(
    @Query() filter: GetPersonalCoursesFilter,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedDto<CourseListedPersonalTeacherDto>> {
    return this.coursesService.findTeaching(filter, currentUser);
  }

  @ApiOperation({
    summary: 'Получить список тегов курсов',
  })
  @ApiOkResponse({
    type: CourseTagDto,
    isArray: true,
    description: 'Список тегов курсов',
  })
  @Get('tags')
  async tags(): Promise<Array<CourseTagDto>> {
    return this.coursesService.tags();
  }

  @ApiOperation({
    summary: 'Получить курс',
  })
  @ApiOkResponse({
    type: CourseDto,
    description: 'Курс',
  })
  @Get(':id')
  async findOne(@Param() searchParams: FindOneByIDParams): Promise<CourseDto> {
    return (await this.coursesService.findOneOrThrowError(
      searchParams,
    )) as CourseDto;
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Получить студентов курса',
    description: 'Доступно учителям и администраторам',
  })
  @ApiOkResponse({
    type: BasicUserNameDto,
    isArray: true,
    description: 'Студенты курса',
  })
  @Get(':id/students')
  async findStudents(
    @Param() searchParams: FindOneByIDParams,
    @CurrentUser() currentUser: User,
  ): Promise<Array<BasicUserNameDto>> {
    return this.coursesService.findStudents(searchParams, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Создать курс',
    description: 'Доступно только администраторам',
  })
  @ApiCreatedResponse({
    type: CourseDto,
    description: 'Созданный курс',
  })
  @FormDataRequest()
  @Post()
  async create(@Body() details: CourseCreateDto): Promise<CourseDto> {
    return this.coursesService.create(details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Обновить курс',
    description: 'Доступно только администраторам',
  })
  @ApiOkResponse({
    type: CourseDto,
    description: 'Обновленный курс',
  })
  @FormDataRequest()
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param() searchParams: FindOneByIDParams,
    @Body() details: CourseUpdateDto,
  ): Promise<CourseDto> {
    return this.coursesService.update(searchParams, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удалить курс',
    description: 'Доступно только администраторам',
  })
  @ApiNoContentResponse({
    description: 'Курс удален',
  })
  @Delete(':id')
  async delete(@Param() searchParams: FindOneByIDParams): Promise<void> {
    await this.coursesService.delete(searchParams);
  }
}
