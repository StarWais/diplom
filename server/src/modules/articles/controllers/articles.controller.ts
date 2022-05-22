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
import { ArticleDto, ArticleListedDto, ArticleTagDto } from '../dto/response';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { ArticleCreateDto, ArticleUpdateDto } from '../dto/request';
import { Role, User } from '@prisma/client';
import { CurrentUser } from '@common/decorators';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';
import { ArticlesGetFilter } from '../filters';
import { FindOneByIDParams, FindOneBySlugParams } from '@common/params';
import { ArticlesService } from '../services';
import { Roles } from '@auth/decorators/roles.decorator';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Получить список тегов статей' })
  @ApiOkResponse({
    type: ArticleTagDto,
    description: 'Список тегов статей',
    isArray: true,
  })
  @Get('tags')
  async tags(): Promise<Array<ArticleTagDto>> {
    return this.articlesService.tags();
  }

  @Get('published')
  @ApiPaginatedResponse(ArticleListedDto)
  @ApiOperation({ summary: 'Получить список опубликованных статей' })
  async findPublished(
    @Query() filter: ArticlesGetFilter,
  ): Promise<PaginatedDto<ArticleListedDto>> {
    return this.articlesService.findMany(filter, false);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiPaginatedResponse(ArticleListedDto)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Получить список всех статей',
    description: 'Доступно только администратору',
  })
  async findAll(
    @Query() filter: ArticlesGetFilter,
  ): Promise<PaginatedDto<ArticleListedDto>> {
    return this.articlesService.findMany(filter, true);
  }

  @ApiOperation({ summary: 'Получить статью по slug' })
  @ApiOkResponse({
    type: ArticleDto,
    description: 'Статья',
  })
  @Get(':slug')
  async findOne(
    @Param() searchDetails: FindOneBySlugParams,
  ): Promise<ArticleDto> {
    return this.articlesService.findOneOrThrowError(searchDetails);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать статью' })
  @ApiCreatedResponse({
    type: ArticleDto,
    description: 'Статья добавлена',
  })
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() details: ArticleCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleDto> {
    return this.articlesService.create(details, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Опубликовать статью',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    type: ArticleDto,
    description: 'Статья опубликована',
  })
  @Post('/:id/publish')
  async publish(
    @Param() searchDetails: FindOneByIDParams,
  ): Promise<ArticleDto> {
    return this.articlesService.publish(searchDetails);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ArticleDto,
    description: 'Статья обновлена',
  })
  @ApiOperation({ summary: 'Обновить статью' })
  @Patch('/:id')
  async update(
    @Param() searchDetails: FindOneByIDParams,
    @Body() details: ArticleUpdateDto,
  ): Promise<ArticleDto> {
    return this.articlesService.update(searchDetails, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Статья удалена',
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удалить статью',
    description: 'Досутпно только администратору',
  })
  @Delete('/:id')
  async delete(@Param() searchDetails: FindOneByIDParams): Promise<void> {
    await this.articlesService.delete(searchDetails);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить лайк к статье' })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ArticleDto,
    description: 'Лайк добавлен/удален',
  })
  @Post(':id/like')
  async like(
    @Param() searchDetails: FindOneByIDParams,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleDto> {
    return this.articlesService.like(searchDetails, currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ArticleDto,
    description: 'Дизлайк добавлен/удален',
  })
  @ApiOperation({ summary: 'Добавить дизлайк к статье' })
  @Post(':id/dislike')
  async dislike(
    @Param() searchDetails: FindOneByIDParams,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleDto> {
    return this.articlesService.dislike(searchDetails, currentUser);
  }
}
