import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateTeacherDto, RateTeacherDto } from './dto/request';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { TeachersService } from './teachers.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators';
import { FindOneByIDParams } from '../../common/params';
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
  async get(@Param() searchDetails: FindOneByIDParams) {
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
    @Param() searchDetails: FindOneByIDParams,
    @Body() details: RateTeacherDto,
    @CurrentUser() user,
  ) {
    await this.teachersService.rate(searchDetails, details, user);
  }
}
