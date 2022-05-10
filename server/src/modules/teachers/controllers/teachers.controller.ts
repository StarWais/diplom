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
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTeacherDto, RateTeacherDto } from '../dto/request';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { TeachersService } from '../services';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators';
import { FindOneByIDParams } from '../../../common/params';
import { TeachersGetFilter } from '../filters';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';
import { TeacherUserDto, TeacherUserListedDto } from '../dto/response';

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
  @ApiNoContentResponse({
    description: 'Пользователь успешно добавлен в список учителей',
  })
  @Post()
  async create(@Body() details: CreateTeacherDto): Promise<void> {
    await this.teachersService.create(details);
  }

  @ApiOperation({
    summary: 'Получить данные об учителе',
  })
  @ApiOkResponse({
    type: TeacherUserDto,
    description: 'Данные об учителе',
  })
  @Get(':id')
  async get(@Param() searchParams: FindOneByIDParams): Promise<TeacherUserDto> {
    return await this.teachersService.findOneOrThrowError(searchParams);
  }

  @ApiOperation({
    summary: 'Получить список учителей',
  })
  @ApiPaginatedResponse(TeacherUserListedDto)
  @Get()
  async findMany(
    @Query() searchDetails: TeachersGetFilter,
  ): Promise<PaginatedDto<TeacherUserListedDto>> {
    return await this.teachersService.findMany(searchDetails);
  }

  @Roles(Role.STUDENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Оценить учителя',
    description: 'Доступно только студентам',
  })
  @ApiNoContentResponse({
    description: 'Успешное оценивание',
  })
  @Post(':id/rate')
  async rate(
    @Param() searchDetails: FindOneByIDParams,
    @Body() details: RateTeacherDto,
    @CurrentUser() user,
  ): Promise<void> {
    await this.teachersService.rate(searchDetails, details, user);
  }
}
