import { ArticleCommentDto } from '../dto/response';
import { FindArticleCommentParams, FindByArticleIdParams } from '../params';
import { ArticleCommentCreateDto } from '../dto/request';
import { User } from '@prisma/client';
import { PaginatedDto } from '../../../common/pagination/pagination';
import { PaginationQuery } from '../../../common/pagination/pagination-query';

export interface IArticlesCommentsController {
  create(
    searchDetails: FindByArticleIdParams,
    details: ArticleCommentCreateDto,
    currentUser: User,
  ): Promise<ArticleCommentDto>;

  findOne(FindArticleCommentParams): Promise<ArticleCommentDto>;

  findMany(
    FindByArticleIdParams,
    paginationDetails: PaginationQuery,
  ): Promise<PaginatedDto<ArticleCommentDto>>;

  delete(searchDetails: FindArticleCommentParams): Promise<void>;
}
