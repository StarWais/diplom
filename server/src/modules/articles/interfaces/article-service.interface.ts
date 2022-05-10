import { Prisma, User } from '@prisma/client';

import { ArticleCreateDto, ArticleUpdateDto } from '../dto/request';
import { ArticleDto, ArticleTagDto } from '../dto/response';
import { ArticlesGetFilter } from '../filters';
import { PaginatedDto } from '../../../common/pagination/pagination';

export interface IArticlesService {
  create(details: ArticleCreateDto, currentUser: User): Promise<ArticleDto>;

  notifyAdminsOnArticleCreate(article: ArticleDto): Promise<void>;

  findOneOrThrowError(
    details: Prisma.ArticleWhereUniqueInput,
  ): Promise<ArticleDto>;

  publish(details: Prisma.ArticleWhereUniqueInput): Promise<ArticleDto>;

  tags(): Promise<Array<ArticleTagDto>>;

  findMany(
    details: ArticlesGetFilter,
    ignoreDrafts,
  ): Promise<PaginatedDto<ArticleDto>>;

  slugExists(slug: string): Promise<boolean>;

  update(
    searchDetails: Prisma.ArticleWhereUniqueInput,
    details: ArticleUpdateDto,
  ): Promise<ArticleDto>;

  generateSlug(title: string): Promise<string>;

  delete(details: Prisma.ArticleWhereUniqueInput): Promise<void>;

  like(
    details: Prisma.ArticleWhereUniqueInput,
    currentUser: User,
  ): Promise<ArticleDto>;

  dislike(
    details: Prisma.ArticleWhereUniqueInput,
    currentUser: User,
  ): Promise<ArticleDto>;
}
