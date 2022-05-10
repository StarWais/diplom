import { PublishingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';
import {
  ArticleAuthorDto,
  ArticleDislikeDto,
  ArticleLikeDto,
  ArticleTagDto,
} from './index';
import { Expose, Type } from 'class-transformer';

export class ArticleDto extends BaseAbstractDto {
  @Expose()
  @ApiProperty({
    description: 'Заголовок статьи',
    type: 'string',
    example: 'Привет мир',
  })
  readonly title: string;

  @Expose()
  @ApiProperty({
    description: 'Slug статьи',
    type: 'string',
    example: 'privet-mir',
  })
  readonly slug: string;

  @Expose()
  @ApiProperty({
    description: 'Текст статьи',
    type: 'string',
    example:
      'Это текст новой статьи. Он длинный и в тексте есть много слов, пробелов.',
  })
  readonly content: string;

  @Expose()
  @ApiProperty({
    description: 'ID автора статьи',
    type: 'number',
    example: 1,
  })
  readonly authorId: number;

  @Expose()
  @ApiProperty({
    description: 'Кол-во просмотров статьи',
    type: 'number',
    example: 100,
  })
  readonly views: number;

  @Expose()
  @ApiProperty({
    description: 'Тэги статьи',
    type: () => ArticleTagDto,
    isArray: true,
  })
  @Type(() => ArticleTagDto)
  readonly tags: Array<ArticleTagDto>;

  @Expose()
  @ApiProperty({
    description: 'Лайки статьи',
    type: () => ArticleLikeDto,
    isArray: true,
  })
  @Type(() => ArticleDislikeDto)
  readonly likes: Array<ArticleLikeDto>;

  @Expose()
  @ApiProperty({
    description: 'Дизлайки статьи',
    type: () => ArticleDislikeDto,
    isArray: true,
  })
  @Type(() => ArticleDislikeDto)
  readonly dislikes: Array<ArticleDislikeDto>;

  @Expose()
  @ApiProperty({
    description: 'Статус статьи',
    enum: PublishingStatus,
    example: PublishingStatus.PUBLISHED,
  })
  readonly status: PublishingStatus;

  @Expose()
  @ApiProperty({
    description: 'Автор статьи',
    type: () => ArticleAuthorDto,
  })
  @Type(() => ArticleAuthorDto)
  readonly author: ArticleAuthorDto;

  constructor(partial: Partial<ArticleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
