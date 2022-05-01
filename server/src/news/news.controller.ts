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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Role } from '@prisma/client';

import { NewsService } from './news.service';
import { NewsGetFilter } from './filters/news-get.filter';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { NewsCreateDto, NewsUpdateDto } from './dto/request';
import { FindOneParams } from '../common/params/find-one-params';

@ApiTags('Новости')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiOperation({
    summary: 'Получить новости',
  })
  @Get()
  async findAll(@Query() filter: NewsGetFilter) {
    return this.newsService.findAll(filter);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Создать новость',
  })
  @FormDataRequest()
  @Post()
  async create(@Body() details: NewsCreateDto, @CurrentUser() currentUser) {
    return this.newsService.create(details, currentUser);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Обновить новость',
  })
  @FormDataRequest()
  @Patch(':id')
  async update(
    @Param() searchDetails: FindOneParams,
    @Body() details: NewsUpdateDto,
  ) {
    return this.newsService.update(searchDetails, details);
  }

  @ApiOperation({
    summary: 'Получить теги новостей',
  })
  @Get('tags')
  async findTags() {
    return this.newsService.tags();
  }

  @ApiOperation({ summary: 'Получить новость по slug' })
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.newsService.findOneOrThrowError({ slug });
  }
}
