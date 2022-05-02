import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { TeachersService } from './teachers.service';
import {
  Body,
  Controller,
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
  CreateTeacherDto,
  RateTeacherDto,
  UpdateTeacherDto,
} from './dto/request';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { FindOneParams } from '../common/params/find-one-params';
import { TeachersGetFilter } from './filters';

@ApiTags('Учителя')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Сделать пользователя учителем',
  })
  @Post()
  async create(@Body() details: CreateTeacherDto) {
    await this.teachersService.create(details);
  }

  @ApiOperation({
    summary: 'Получить данные об учителе',
  })
  @Get(':id')
  async get(@Param() searchDetails: FindOneParams) {
    return await this.teachersService.findTeacherWithUserInfoOrThrowError(
      searchDetails,
    );
  }

  @ApiOperation({
    summary: 'Получить список учителей',
  })
  @Get()
  async findMany(@Query() searchDetails: TeachersGetFilter) {
    return await this.teachersService.findAll(searchDetails);
  }

  @Roles(Role.ADMIN, Role.STUDENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Оценить учителя',
  })
  @Post(':id/rate')
  async rate(
    @Param() searchDetails: FindOneParams,
    @Body() details: RateTeacherDto,
    @CurrentUser() user,
  ) {
    await this.teachersService.rate(searchDetails, details, user);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить данные об учителе',
  })
  @Patch(':id')
  async update(
    @Param() searchParams: FindOneParams,
    @Body() details: UpdateTeacherDto,
    @CurrentUser() currentUser,
  ) {
    await this.teachersService.update(searchParams, details, currentUser);
  }
}
