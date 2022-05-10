import { User } from '@prisma/client';

import { FindArticleCommentParams, FindByArticleIdParams } from '../params';
import { ArticleCommentDto } from '../dto/response';
import { ArticleCommentCreateDto } from '../dto/request';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { PaginatedDto } from '../../../common/pagination/pagination';

export interface IArticlesCommentsService {
  findOneOrThrowError(
    searchDetails: FindArticleCommentParams,
  ): Promise<ArticleCommentDto>;

  create(
    articleSearchDetails: FindByArticleIdParams,
    details: ArticleCommentCreateDto,
    user: User,
  ): Promise<ArticleCommentDto>;

  findMany(
    articleSearchDetails: FindByArticleIdParams,
    paginationDetails: PaginationQuery,
  ): Promise<PaginatedDto<ArticleCommentDto>>;

  delete(searchDetails: FindArticleCommentParams): Promise<void>;
}
