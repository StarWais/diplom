import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OlympicsTasksVariantsService } from '@olympics/services';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindOlympicTaskParams,
  FindOlympicTaskVariantParams,
} from '@olympics/params';
import {
  OlympicTaskAnswerVariantCreateDto,
  OlympicTaskAnswerVariantUpdateDto,
} from '@olympics/dto/request';
import { OlympicTaskAnswerVariantDto } from '@olympics/dto/response';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';

@Controller('olympics/:olympicsId/steps/:stepsId/tasks/:taskId/variants')
@ApiTags('Варианты ответов на задания этапа олимпиады')
export class OlympicsTasksVariantsController {
  constructor(
    private readonly olympicsTasksVariantsService: OlympicsTasksVariantsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Создать вариант решения задания этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiCreatedResponse({
    description: 'Вариант решения задания этапа олимпиады добавлен',
    type: OlympicTaskAnswerVariantDto,
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Param() searchParams: FindOlympicTaskParams,
    @Body() details: OlympicTaskAnswerVariantCreateDto,
  ): Promise<OlympicTaskAnswerVariantDto> {
    return this.olympicsTasksVariantsService.create(searchParams, details);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить вариант решения задания этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    description: 'Вариант решения задания этапа олимпиады обновлен',
    type: OlympicTaskAnswerVariantDto,
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param() searchParams: FindOlympicTaskVariantParams,
    @Body() details: OlympicTaskAnswerVariantUpdateDto,
  ): Promise<OlympicTaskAnswerVariantDto> {
    return this.olympicsTasksVariantsService.update(searchParams, details);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить вариант решения задания этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiNoContentResponse({
    description: 'Вариант решения задания этапа олимпиады удален',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(
    @Param() searchParams: FindOlympicTaskVariantParams,
  ): Promise<void> {
    await this.olympicsTasksVariantsService.delete(searchParams);
  }
}
