import { ApiProperty, PickType } from '@nestjs/swagger';
import { Article, ArticleStatus } from '@prisma/client';
import { ArticleLikeEntity } from './article-like.entity';
import { ArticleTagEntity } from './article-tag.entity';
import { CreatedUpdatedEntity } from '../../common/entities';

export class ArticleEntity extends CreatedUpdatedEntity implements Article {
  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  readonly id: number;
  @ApiProperty({
    example: 'Научная статья по математике',
  })
  readonly title: string;
  @ApiProperty({
    example: 'Текст статьи по математике',
  })
  readonly content: string;
  @ApiProperty({
    example: ArticleStatus.DRAFT,
    enum: ArticleStatus,
  })
  readonly status: ArticleStatus;
  @ApiProperty({
    example: 'nauchnaya-statya-po-matematike',
  })
  readonly slug: string;
  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  readonly authorId: number;
  @ApiProperty({
    example: 24,
    type: 'integer',
  })
  readonly views: number;
  @ApiProperty({
    type: PickType(ArticleTagEntity, ['name'] as const),
    isArray: true,
  })
  readonly tags: Pick<ArticleTagEntity, 'name'>[];

  @ApiProperty({
    type: ArticleLikeEntity,
    isArray: true,
  })
  readonly likes: ArticleLikeEntity[];

  @ApiProperty({
    type: ArticleLikeEntity,
    isArray: true,
  })
  readonly dislikes: ArticleLikeEntity[];

  constructor(partial: Partial<ArticleEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
