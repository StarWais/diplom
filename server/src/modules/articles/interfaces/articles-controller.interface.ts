import { ArticleDto, ArticleListedDto, ArticleTagDto } from '../dto/response';
import { PaginatedDto } from '../../../common/pagination/pagination';
import { ArticlesGetFilter } from '../filters';
import { User } from '@prisma/client';
import { FindOneByIDParams, FindOneBySlugParams } from '../../../common/params';
import { ArticleCreateDto, ArticleUpdateDto } from '../dto/request';

export interface IArticlesController {
  tags(): Promise<Array<ArticleTagDto>>;

  findPublished(
    filter: ArticlesGetFilter,
  ): Promise<PaginatedDto<ArticleListedDto>>;

  findAll(filter: ArticlesGetFilter): Promise<PaginatedDto<ArticleListedDto>>;

  findOne(searchDetails: FindOneBySlugParams): Promise<ArticleDto>;

  create(details: ArticleCreateDto, currentUser: User): Promise<ArticleDto>;

  publish(searchDetails: FindOneByIDParams): Promise<ArticleDto>;

  update(
    searchDetails: FindOneByIDParams,
    details: ArticleUpdateDto,
  ): Promise<ArticleDto>;

  delete(searchDetails: FindOneByIDParams): Promise<void>;

  like(
    searchDetails: FindOneByIDParams,
    currentUser: User,
  ): Promise<ArticleDto>;

  dislike(
    searchDetails: FindOneByIDParams,
    currentUser: User,
  ): Promise<ArticleDto>;
}
