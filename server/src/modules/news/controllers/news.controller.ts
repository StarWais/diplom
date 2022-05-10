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
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Role, User } from '@prisma/client';

import { NewsService } from '../services';
import { NewsGetFilter } from '../filters/news-get.filter';
import { CurrentUser } from '../../../common/decorators';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { NewsCreateDto, NewsUpdateDto } from '../dto/request';
import { FindOneByIDParams, FindOneBySlugParams } from '../../../common/params';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';
import { NewsDto, NewsListedDto, NewsTagDto } from '../dto/response';

@ApiTags('Новости')
@ApiExtraModels(PaginatedDto, NewsListedDto)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiOperation({
    summary: 'Получить список новостей',
  })
  @ApiPaginatedResponse(NewsListedDto)
  @Get()
  async findMany(
    @Query() filter: NewsGetFilter,
  ): Promise<PaginatedDto<NewsListedDto>> {
    return this.newsService.findMany(filter);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Создать новость',
    description: 'Доступно только администратору',
  })
  @ApiCreatedResponse({
    type: NewsDto,
    description: 'Новость создана',
  })
  @FormDataRequest()
  @Post()
  async create(
    @Body() details: NewsCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<NewsDto> {
    return this.newsService.create(details, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Обновить новость',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    type: NewsDto,
    description: 'Новость обновлена',
  })
  @FormDataRequest()
  @Patch(':id')
  async update(
    @Param() searchParams: FindOneByIDParams,
    @Body() details: NewsUpdateDto,
  ): Promise<NewsDto> {
    return this.newsService.update(searchParams, details);
  }

  @ApiOperation({
    summary: 'Получить теги новостей',
  })
  @ApiOkResponse({
    type: NewsTagDto,
    isArray: true,
    description: 'Теги новостей',
  })
  @Get('tags')
  async tags(): Promise<Array<NewsTagDto>> {
    return this.newsService.tags();
  }

  @ApiOperation({ summary: 'Получить новость по slug' })
  @ApiOkResponse({
    type: NewsDto,
    description: 'Новость',
  })
  @Get(':slug')
  async findOne(@Param() searchParams: FindOneBySlugParams): Promise<NewsDto> {
    return this.newsService.findOneOrThrowError(searchParams);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удалить новость',
    description: 'Доступно только администратору',
  })
  @ApiNoContentResponse({
    description: 'Новость удалена',
  })
  @Delete(':id')
  async delete(@Param() searchParams: FindOneByIDParams): Promise<void> {
    return this.newsService.delete(searchParams);
  }
}
