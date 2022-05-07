import { Article, ArticleStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';
import {
  ArticleAuthorDto,
  ArticleDislikeDto,
  ArticleLikeDto,
  ArticleTagDto,
} from './index';

export class ArticleDto extends BaseAbstractDto implements Article {
  @ApiProperty({
    description: 'Заголовок статьи',
    type: 'string',
    example: 'Привет мир',
  })
  readonly title: string;

  @ApiProperty({
    description: 'Slug статьи',
    type: 'string',
    example: 'privet-mir',
  })
  readonly slug: string;

  @ApiProperty({
    description: 'Текст статьи',
    type: 'string',
    example:
      'Это текст новой статьи. Он длинный и в тексте есть много слов, пробелов.',
  })
  readonly content: string;

  @ApiProperty({
    description: 'ID автора статьи',
    type: 'number',
    example: 1,
  })
  readonly authorId: number;

  @ApiProperty({
    description: 'Кол-во просмотров статьи',
    type: 'number',
    example: 100,
  })
  readonly views: number;

  @ApiProperty({
    description: 'Тэги статьи',
    type: () => [ArticleTagDto],
  })
  readonly tags: Array<ArticleTagDto>;

  @ApiProperty({
    description: 'Лайки статьи',
    type: () => [ArticleLikeDto],
  })
  readonly likes: Array<ArticleLikeDto>;

  @ApiProperty({
    description: 'Дизлайки статьи',
    type: () => [ArticleDislikeDto],
  })
  readonly dislikes: Array<ArticleDislikeDto>;

  @ApiProperty({
    description: 'Статус статьи',
    enum: ArticleStatus,
    example: ArticleStatus.PUBLISHED,
  })
  readonly status: ArticleStatus;

  @ApiProperty({
    description: 'Автор статьи',
    type: () => ArticleAuthorDto,
  })
  readonly author: ArticleAuthorDto;

  constructor(partial: Partial<ArticleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
