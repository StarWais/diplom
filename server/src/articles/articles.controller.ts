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
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { User, Role } from '@prisma/client';

import { PaginationQuery } from '../common/pagination/pagination-query';
import { FindOneParams } from '../common/params/find-one-params';
import { RolesGuard, JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ArticlesService } from './articles.service';
import {
  ArticleCommentCreateDto,
  ArticleCreateDto,
  ArticleUpdateDto,
} from './dto/request';
import { Roles } from '../auth/decorators/roles.decorator';
import { ArticlesGetFilter } from './filters';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Получить список тегов статей' })
  @HttpCode(HttpStatus.OK)
  @Get('tags')
  async tags() {
    return this.articlesService.tags();
  }

  @ApiOperation({ summary: 'Получить статью по slug' })
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.articlesService.findOneOrThrowError({ slug });
  }

  @Get()
  @ApiOperation({ summary: 'Получить список статей' })
  async findMany(@Query() filter: ArticlesGetFilter) {
    return this.articlesService.findMany(filter);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать статью' })
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() details: ArticleCreateDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.articlesService.create(details, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Опубликовать статью' })
  @Post('/:id/publish')
  async publish(@Param() { id }: FindOneParams) {
    return this.articlesService.publish({ id });
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить статью' })
  @Patch('/:id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() details: ArticleUpdateDto,
  ) {
    return this.articlesService.update({ id }, details);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить статью' })
  @Delete('/:id')
  async delete(@Param() { id }: FindOneParams) {
    await this.articlesService.delete({ id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить коментарий к статье' })
  @ApiBearerAuth()
  @Post(':id/comments')
  async createComment(
    @Param() { id }: FindOneParams,
    @Body() details: ArticleCommentCreateDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.articlesService.createComment({ id }, details, currentUser);
  }

  @ApiOperation({ summary: 'Получить коментарии к статье' })
  @Get(':id/comments')
  async findComments(
    @Param() { id }: FindOneParams,
    @Query() paginationDetails: PaginationQuery,
  ) {
    return this.articlesService.findComments({ id }, paginationDetails);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить коментарий к статье' })
  @Delete('/comments/:id')
  async deleteComment(@Param() { id }: FindOneParams) {
    await this.articlesService.deleteComment({ id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить лайк к статье' })
  @Post(':id/like')
  async like(@Param() { id }: FindOneParams, @CurrentUser() currentUser: User) {
    return this.articlesService.like({ id }, currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить дизлайк к статье' })
  @Post(':id/dislike')
  async dislike(
    @Param() { id }: FindOneParams,
    @CurrentUser() currentUser: User,
  ) {
    return this.articlesService.dislike({ id }, currentUser);
  }
}
