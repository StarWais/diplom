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
import { OlympicsTasksService } from '@olympics/services';
import { FindOlympicStepParams, FindOlympicTaskParams } from '@olympics/params';
import {
  OlympicStepDto,
  OlympicTaskDto,
  OlympicTaskFullDto,
} from '@olympics/dto/response';
import { PaginationQuery } from '@pagination/pagination-query';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { CurrentUser } from '@common/decorators';
import { Role, User } from '@prisma/client';
import {
  OlympicTaskCreateDto,
  OlympicTaskUpdateDto,
} from '@olympics/dto/request';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';

@Controller('olympics/:olympicsId/steps/:stepId/tasks')
@ApiTags('Задания этапа олимпиады')
export class OlympicsTasksController {
  constructor(private readonly olympicsTasksService: OlympicsTasksService) {}

  @Get('full')
  @ApiOperation({
    summary: 'Получить полные задания этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiPaginatedResponse(OlympicTaskFullDto)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findFull(
    @Param() searchParams: FindOlympicStepParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<OlympicTaskFullDto>> {
    return this.olympicsTasksService.findFull(searchParams, filter);
  }
  @Get(':taskId')
  @ApiOperation({
    summary: 'Получить задание этап олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    description: 'Задание этапа олимпиады',
    type: OlympicTaskFullDto,
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(
    @Param() searchParams: FindOlympicTaskParams,
  ): Promise<OlympicTaskFullDto> {
    return this.olympicsTasksService.findOneOrThrowError(searchParams);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить задания этапа олимпиады',
    description: 'Доступно только студенту',
  })
  @ApiPaginatedResponse(OlympicTaskDto)
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findMany(
    @Param() searchParams: FindOlympicStepParams,
    @Query() filter: PaginationQuery,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedDto<OlympicTaskDto>> {
    return this.olympicsTasksService.findMany(
      searchParams,
      filter,
      currentUser,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Создать задание этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiCreatedResponse({
    description: 'Задание этапа олимпиады',
    type: OlympicTaskFullDto,
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Param() searchParams: FindOlympicStepParams,
    @Body() details: OlympicTaskCreateDto,
  ): Promise<OlympicTaskFullDto> {
    return this.olympicsTasksService.create(searchParams, details);
  }

  @Patch(':taskId')
  @ApiOperation({
    summary: 'Обновить задание этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    description: 'Задание этапа олимпиады обновлено',
    type: OlympicTaskFullDto,
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param() searchParams: FindOlympicTaskParams,
    @Body() details: OlympicTaskUpdateDto,
  ): Promise<OlympicTaskFullDto> {
    return this.olympicsTasksService.update(searchParams, details);
  }

  @Delete(':taskId')
  @ApiOperation({
    summary: 'Удалить задание этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiNoContentResponse({
    description: 'Задание этапа олимпиады удалено',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param() searchParams: FindOlympicTaskParams): Promise<void> {
    await this.olympicsTasksService.delete(searchParams);
  }
}
