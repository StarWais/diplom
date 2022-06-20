import { OlympicsReviewsService } from '@olympics/services';
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
import {
  FindByOlympicsIdParams,
  FindOlympicReviewParams,
} from '@olympics/params';
import { OlympicReviewCreateDto } from '@olympics/dto/request/olympic-review-create.dto';
import { CurrentUser } from '@common/decorators';
import { Role, User } from '@prisma/client';
import { PaginationQuery } from '@pagination/pagination-query';
import { OlympicReviewUpdateDto } from '@olympics/dto/request/olympic-review-update.dto';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';
import { OlympicReviewDto } from '@olympics/dto/response';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';

@Controller('olympics/:olympicsId/reviews')
@ApiTags('Отзывы к олимпиадам')
export class OlympicsReviewsController {
  constructor(
    private readonly olympicsReviewsService: OlympicsReviewsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Добавить отзыв на олимпиаду',
    description: 'Доступно только студенту',
  })
  @ApiCreatedResponse({
    description: 'Отзыв на олимпиаду успешно добавлен',
    type: OlympicReviewDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Param() searchParams: FindByOlympicsIdParams,
    @Body() details: OlympicReviewCreateDto,
    @CurrentUser() user: User,
  ): Promise<OlympicReviewDto> {
    return this.olympicsReviewsService.create(searchParams, details, user);
  }

  @ApiOperation({
    summary: 'Получить список опубликованных отзывов на олимпиаду',
  })
  @Get('published')
  @ApiPaginatedResponse(OlympicReviewDto)
  async findPublished(
    @Param() searchParams: FindByOlympicsIdParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<OlympicReviewDto>> {
    return this.olympicsReviewsService.findMany(searchParams, filter, true);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить отзыв на олимпиаду',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    description: 'Отзыв на олимпиаду',
    type: OlympicReviewDto,
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(
    @Param() searchParams: FindOlympicReviewParams,
  ): Promise<OlympicReviewDto> {
    return this.olympicsReviewsService.findOneOrThrowError(searchParams);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить отзыв на олимпиаду',
    description: 'Доступно только администратору',
  })
  @ApiNoContentResponse({
    description: 'Отзыв на олимпиаду успешно удален',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param() searchParams: FindOlympicReviewParams): Promise<void> {
    await this.olympicsReviewsService.delete(searchParams);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить отзыв на олимпиаду',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    description: 'Отзыв на олимпиаду успешно обновлен',
    type: OlympicReviewDto,
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param() searchParams: FindOlympicReviewParams,
    @Body() details: OlympicReviewUpdateDto,
  ): Promise<OlympicReviewDto> {
    return this.olympicsReviewsService.update(searchParams, details);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список всех отзывов на олимпиаду',
    description: 'Доступно только администратору',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiPaginatedResponse(OlympicReviewDto)
  async findAll(
    @Param() searchParams: FindByOlympicsIdParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<OlympicReviewDto>> {
    return this.olympicsReviewsService.findMany(searchParams, filter);
  }
}
