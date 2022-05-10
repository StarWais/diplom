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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleCommentCreateDto } from '../dto/request';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../../common/pagination/pagination';
import { Role, User } from '@prisma/client';
import { CurrentUser } from '../../../common/decorators';
import { ArticleCommentDto } from '../dto/response';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { FindArticleCommentParams, FindByArticleIdParams } from '../params';
import { Roles } from '../../auth/decorators/roles.decorator';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import {
  IArticlesCommentsController,
  IArticlesCommentsService,
} from '../interfaces';

@Controller('articles/:articleId/comments')
@ApiTags('Комментарии к статьям')
export class ArticlesCommentsController implements IArticlesCommentsController {
  constructor(
    private readonly articleCommentsService: IArticlesCommentsService,
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
  async create(
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

  @Get(':id')
  @ApiOperation({
    summary: 'Получить коментарий к статье',
  })
  @ApiOkResponse({
    type: ArticleCommentDto,
    description: 'Коментарий к статье',
  })
  async findOne(
    @Param() searchDetails: FindArticleCommentParams,
  ): Promise<ArticleCommentDto> {
    return this.articleCommentsService.findOneOrThrowError(searchDetails);
  }

  @ApiOperation({ summary: 'Получить коментарии к статье' })
  @ApiPaginatedResponse(ArticleCommentDto)
  @Get()
  async findMany(
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
    description: 'Коментарий к статье удален',
  })
  @ApiOperation({
    summary: 'Удалить коментарий к статье',
    description: 'Доступно только администратору',
  })
  @Delete(':id')
  async delete(
    @Param() searchDetails: FindArticleCommentParams,
  ): Promise<void> {
    await this.articleCommentsService.delete(searchDetails);
  }
}
