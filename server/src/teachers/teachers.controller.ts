import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../auth/guards';
import { TeachersService } from './teachers.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/request';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { FindOneParams } from '../common/params/find-one-params';

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

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить данные об учителе',
  })
  @Patch()
  async update(
    @Param() searchParams: FindOneParams,
    @Body() details: UpdateTeacherDto,
    @CurrentUser() currentUser,
  ) {
    await this.teachersService.update(searchParams, details, currentUser);
  }
}
