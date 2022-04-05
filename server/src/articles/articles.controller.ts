import { FindOneParams } from './../common/params/find-one-params';
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
} from '@nestjs/swagger';
import { User, Role } from '@prisma/client';

import { ApiPaginatedDto, Paginated } from './../common/pagination/pagination';
import { RolesGuard } from './../auth/guards/roles.guard';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { CurrentUser } from './../decorators/current-user.decorator';
import { ArticlesService } from './articles.service';
import { ArticleCreateDto, ArticleUpdateDto } from './dto';
import { ArticleEntity, ArticleTagEntity } from './entities';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ArticlesGetFilter } from './filters/articles-get-filter';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Получить статью по slug' })
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
  @ApiForbiddenResponse({ description: 'Нет прав на публикацию' })
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
  @ApiNoContentResponse({ description: 'Статья успешно удалена' })
  @ApiForbiddenResponse({ description: 'Нет прав на удаление статьи' })
  @Delete('/:id')
  async delete(@Param() { id }: FindOneParams): Promise<void> {
    await this.articlesService.delete({ id });
  }

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
}
