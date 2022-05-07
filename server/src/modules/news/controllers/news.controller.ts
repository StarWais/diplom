import {
  Body,
  Controller,
  Get,
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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Role } from '@prisma/client';

import { NewsService } from '../services/news.service';
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
import { NewsDto, NewsTagDto } from '../dto/response';

@ApiTags('Новости')
@ApiExtraModels(PaginatedDto)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiOperation({
    summary: 'Получить список новостей',
  })
  @ApiPaginatedResponse(NewsDto)
  @Get()
  async findMany(
    @Query() filter: NewsGetFilter,
  ): Promise<PaginatedDto<NewsDto>> {
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
    @CurrentUser() currentUser,
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
    @Param() searchDetails: FindOneByIDParams,
    @Body() details: NewsUpdateDto,
  ) {
    return this.newsService.update(searchDetails, details);
  }

  @ApiOperation({
    summary: 'Получить теги новостей',
  })
  @ApiOkResponse({
    type: [NewsTagDto],
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
  async findOne(@Param() searchDetails: FindOneBySlugParams): Promise<NewsDto> {
    return this.newsService.findOneOrThrowError(searchDetails);
  }
}
