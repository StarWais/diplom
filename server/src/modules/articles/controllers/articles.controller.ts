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
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

import { FindOneByIDParams, FindOneBySlugParams } from '../../../common/params';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CurrentUser } from '../../../common/decorators';
import { ArticlesService } from '../services';
import { ArticleCreateDto, ArticleUpdateDto } from '../dto/request';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ArticlesGetFilter } from '../filters';
import {
  ArticleCommentDto,
  ArticleDto,
  ArticleListedDto,
  ArticleTagDto,
} from '../dto/response';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';

@ApiTags('Статьи')
@Controller('articles')
@ApiExtraModels(PaginatedDto, ArticleListedDto, ArticleCommentDto)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Получить список тегов статей' })
  @ApiOkResponse({
    type: [ArticleTagDto],
    description: 'Список тегов статей',
  })
  @Get('tags')
  async tags(): Promise<Array<ArticleTagDto>> {
    return this.articlesService.tags();
  }

  @Get('published')
  @ApiPaginatedResponse(ArticleListedDto)
  @ApiOperation({ summary: 'Получить список опубликованных статей' })
  async findPublished(@Query() filter: ArticlesGetFilter) {
    return this.articlesService.findMany(filter);
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
  async findMany(@Query() filter: ArticlesGetFilter) {
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
  @ApiBearerAuth('Токен')
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
