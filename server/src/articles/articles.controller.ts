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
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User, Role } from '@prisma/client';

import { PaginationQuery } from '../common/pagination/pagination-query';
import { FindOneParams } from '../common/params/find-one-params';
import { ApiPaginatedDto, Paginated } from '../common/pagination/pagination';
import { RolesGuard, JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ArticlesService } from './articles.service';
import {
  ArticleCommentCreateDto,
  ArticleCreateDto,
  ArticleUpdateDto,
} from './dto';
import {
  ArticleCommentEntity,
  ArticleEntity,
  ArticleTagEntity,
} from './entities';
import { Roles } from '../auth/decorators/roles.decorator';
import { ArticlesGetFilter } from './filters';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  @ApiOperation({ summary: 'Получить список тегов статей' })
  @ApiOkResponse({
    type: ArticleTagEntity,
    isArray: true,
    description: 'Статья',
  })
  @HttpCode(HttpStatus.OK)
  @Get('tags')
  async tags(): Promise<ArticleTagEntity[]> {
    return this.articlesService.tags();
  }

  @ApiOperation({ summary: 'Получить статью по slug' })
  @ApiNotFoundResponse({ description: 'Статья не найдена' })
  @ApiOkResponse({ type: ArticleEntity, description: 'Статья' })
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ArticleEntity> {
    return this.articlesService.findOne({ slug });
  }

  @Get()
  @ApiOperation({ summary: 'Получить список статей' })
  @ApiPaginatedDto(ArticleEntity, 'Статьи')
  async findMany(
    @Query() filter: ArticlesGetFilter,
  ): Promise<Paginated<ArticleEntity>> {
    return this.articlesService.findMany(filter);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать статью' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ArticleEntity, description: 'Статья' })
  @Post()
  async create(
    @Body() details: ArticleCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleEntity> {
    return this.articlesService.create(details, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Опубликовать статью' })
  @ApiOkResponse({
    type: ArticleEntity,
    description: 'Статья',
  })
  @ApiForbiddenResponse({ description: 'Нет прав на публикацию статьи' })
  @ApiNotFoundResponse({ description: 'Статья не найдена' })
  @Post('/:id/publish')
  async publish(@Param() { id }: FindOneParams): Promise<ArticleEntity> {
    return this.articlesService.publish({ id });
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить статью' })
  @ApiOkResponse({
    type: ArticleEntity,
    description: 'Статья',
  })
  @ApiNotFoundResponse({ description: 'Статья не найдена' })
  @ApiForbiddenResponse({ description: 'Нет прав на публикацию статьи' })
  @Patch('/:id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() details: ArticleUpdateDto,
  ): Promise<ArticleEntity> {
    return this.articlesService.update({ id }, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить статью' })
  @ApiNotFoundResponse({ description: 'Статья не найдена' })
  @ApiNoContentResponse({ description: 'Статья успешно удалена' })
  @ApiForbiddenResponse({ description: 'Нет прав на удаление статьи' })
  @Delete('/:id')
  async delete(@Param() { id }: FindOneParams): Promise<void> {
    await this.articlesService.delete({ id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить коментарий к статье' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ArticleCommentEntity, description: 'Коментарий' })
  @Post(':id/comments')
  async createComment(
    @Param() { id }: FindOneParams,
    @Body() details: ArticleCommentCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleCommentEntity> {
    return this.articlesService.createComment({ id }, details, currentUser);
  }

  @ApiOperation({ summary: 'Получить коментарии к статье' })
  @ApiPaginatedDto(ArticleCommentEntity, 'Коментарии к статье')
  @Get(':id/comments')
  async findComments(
    @Param() { id }: FindOneParams,
    @Query() paginationDetails: PaginationQuery,
  ): Promise<Paginated<ArticleCommentEntity>> {
    return this.articlesService.findComments({ id }, paginationDetails);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить коментарий к статье' })
  @ApiNotFoundResponse({ description: 'Коментарий не найден' })
  @ApiNoContentResponse({ description: 'Коментарий успешно удален' })
  @ApiForbiddenResponse({ description: 'Нет прав на удаление коментария' })
  @Delete('/comments/:id')
  async deleteComment(@Param() { id }: FindOneParams): Promise<void> {
    await this.articlesService.deleteComment({ id });
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Лайк поставлен', type: ArticleEntity })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить лайк к статье' })
  @ApiNotFoundResponse({ description: 'Статья не найдена' })
  @Post(':id/like')
  async like(
    @Param() { id }: FindOneParams,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleEntity> {
    return this.articlesService.like({ id }, currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить дизлайк к статье' })
  @ApiNotFoundResponse({ description: 'Статья не найдена' })
  @ApiOkResponse({ description: 'Дизлайк поставлен', type: ArticleEntity })
  @Post(':id/dislike')
  async dislike(
    @Param() { id }: FindOneParams,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleEntity> {
    return this.articlesService.dislike({ id }, currentUser);
  }
}
