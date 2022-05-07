import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';

import { ArticleCommentCreateDto } from '../dto/request';
import { ArticleCommentDto } from '../dto/response';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { FindArticleCommentParams, FindByArticleIdParams } from '../params';
import { CommentNotFoundException } from '../exceptions';
import { ArticleCommentInclude } from '../interfaces';
import { ArticlesService } from './articles.service';

@Injectable()
export class ArticlesCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesService: ArticlesService,
  ) {}

  private articleCommentIncludes: ArticleCommentInclude = {
    include: {
      author: true,
    },
  };

  private async checkIfCommentExistsOrThrowError(
    searchDetails: FindArticleCommentParams,
  ): Promise<void> {
    const comment = await this.prisma.articleComment.findFirst({
      where: searchDetails,
    });
    if (!comment) {
      throw new CommentNotFoundException(searchDetails.id);
    }
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
    return Paginate<ArticleCommentDto, Prisma.ArticleCommentFindManyArgs>(
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
    await this.checkIfCommentExistsOrThrowError(searchDetails);
    await this.prisma.articleComment.delete({
      where: searchDetails,
    });
  }
}
