import { FaqService } from '../services';
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
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { FindOneByIDParams } from '@common/params';
import { FaqDto } from '@faq/dto/response';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';
import { PaginationQuery } from '@pagination/pagination-query';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { CreateFaqDto, UpdateFaqDto } from '@faq/dto/request';

@Controller()
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: FaqDto, description: 'FAQ' })
  @Get(':id')
  @ApiOperation({
    summary: 'Получить FAQ',
    description: 'Доступно только администратору',
  })
  async findOne(@Param() searchParams: FindOneByIDParams): Promise<FaqDto> {
    return this.faqService.findOneOrThrowError(searchParams);
  }

  @ApiPaginatedResponse(FaqDto)
  @Get('/answered')
  @ApiOperation({
    summary: 'Получить список отвеченных FAQ',
  })
  async findPublished(
    @Query() query: PaginationQuery,
  ): Promise<PaginatedDto<FaqDto>> {
    return this.faqService.findPublished(query);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiPaginatedResponse(FaqDto)
  @ApiOperation({
    summary: 'Получить список всех FAQ',
    description: 'Доступно только администратору',
  })
  @Get('/published')
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<PaginatedDto<FaqDto>> {
    return this.faqService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiCreatedResponse({
    type: FaqDto,
    description: 'Созданный FAQ',
  })
  @ApiOperation({
    summary: 'Создать FAQ',
  })
  async create(@Body() details: CreateFaqDto): Promise<FaqDto> {
    return this.faqService.create(details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Обновить FAQ',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({ type: FaqDto, description: 'обновленный вопрос FAQ' })
  @Patch(':id')
  async update(
    @Param() searchParams: FindOneByIDParams,
    @Body() details: UpdateFaqDto,
  ): Promise<FaqDto> {
    return this.faqService.update(searchParams, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить FAQ',
    description: 'Доступно только администратору',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ type: FaqDto, description: 'Вопрос FAQ удален' })
  @Delete(':id')
  async delete(@Param() searchParams: FindOneByIDParams): Promise<void> {
    return this.faqService.delete(searchParams);
  }
}
