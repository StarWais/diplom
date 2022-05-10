import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';

import { ArticleCommentInclude } from '../interfaces';
import { ArticlesService } from './articles.service';
import { FindArticleCommentParams, FindByArticleIdParams } from '../params';
import { ArticleCommentNotFoundException } from '../exceptions';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { ArticleCommentCreateDto } from '../dto/request';
import { ArticleCommentDto } from '../dto/response';

@Injectable()
export class ArticlesCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesService: ArticlesService,
  ) {}

  private readonly articleCommentIncludes: ArticleCommentInclude = {
    include: {
      author: true,
    },
  };

  async findOneOrThrowError(
    searchDetails: FindArticleCommentParams,
  ): Promise<ArticleCommentDto> {
    const result = await this.prisma.articleComment.findFirst({
      where: searchDetails,
      ...this.articleCommentIncludes,
    });
    if (!result) {
      throw new ArticleCommentNotFoundException(searchDetails.id);
    }
    return new ArticleCommentDto(result);
  }

  async create(
    articleSearchDetails: FindByArticleIdParams,
    details: ArticleCommentCreateDto,
    user: User,
  ): Promise<ArticleCommentDto> {
    const { articleId } = articleSearchDetails;
    await this.articlesService.findOneOrThrowError({
      id: articleId,
    });

    const comment = await this.prisma.articleComment.create({
      data: {
        ...details,
        article: {
          connect: {
            id: articleId,
          },
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      },
      ...this.articleCommentIncludes,
    });

    return new ArticleCommentDto(comment);
  }

  async findMany(
    articleSearchDetails: FindByArticleIdParams,
    paginationDetails: PaginationQuery,
  ): Promise<PaginatedDto<ArticleCommentDto>> {
    const { articleId } = articleSearchDetails;
    await this.articlesService.findOneOrThrowError({
      id: articleId,
    });
    return Paginate<Prisma.ArticleCommentFindManyArgs>(
      ArticleCommentDto,
      paginationDetails,
      this.prisma,
      'articleComment',
      {
        where: {
          articleId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...this.articleCommentIncludes,
      },
      (comment) => new ArticleCommentDto(comment),
    );
  }

  async delete(searchDetails: FindArticleCommentParams): Promise<void> {
    await this.findOneOrThrowError(searchDetails);
    await this.prisma.articleComment.delete({
      where: searchDetails,
    });
  }
}
