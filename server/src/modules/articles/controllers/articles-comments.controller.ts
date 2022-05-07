import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';

import { ArticlesCommentsService } from '../services';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleCommentDto } from '../dto/response';
import { ArticleCommentCreateDto } from '../dto/request';
import { CurrentUser } from '../../../common/decorators';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FindArticleCommentParams, FindByArticleIdParams } from '../params';

@Controller('articles/:articleId/comments')
@ApiTags('Статьи')
export class ArticlesCommentsController {
  constructor(
    private readonly articleCommentsService: ArticlesCommentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Добавить коментарий к статье',
  })
  @ApiCreatedResponse({
    type: ArticleCommentDto,
    description: 'Коментарий добавлен',
  })
  @ApiBearerAuth()
  @Post()
  async createComment(
    @Param() searchDetails: FindByArticleIdParams,
    @Body() details: ArticleCommentCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<ArticleCommentDto> {
    return this.articleCommentsService.create(
      searchDetails,
      details,
      currentUser,
    );
  }

  @ApiOperation({ summary: 'Получить коментарии к статье' })
  @ApiPaginatedResponse(ArticleCommentDto)
  @Get()
  async findComments(
    @Param() searchDetails: FindByArticleIdParams,
    @Query() paginationDetails: PaginationQuery,
  ): Promise<PaginatedDto<ArticleCommentDto>> {
    return this.articleCommentsService.findMany(
      searchDetails,
      paginationDetails,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'Коментарий удален',
  })
  @ApiOperation({
    summary: 'Удалить коментарий к статье',
    description: 'Доступно только администратору',
  })
  @Delete(':id')
  async deleteComment(
    @Param() searchDetails: FindArticleCommentParams,
  ): Promise<void> {
    await this.articleCommentsService.delete(searchDetails);
  }
}
