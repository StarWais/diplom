import { ApiProperty } from '@nestjs/swagger';
import { Article, ArticleStatus } from '@prisma/client';
import { ArticleTagEntity } from './article-tag.entity';

export class ArticleEntity implements Article {
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
    example: Date.now(),
    type: 'date-time',
  })
  readonly createdAt: Date;
  @ApiProperty({
    example: Date.now(),
    type: 'date-time',
  })
  readonly updatedAt: Date;
  @ApiProperty({
    type: ArticleTagEntity,
    isArray: true,
    example: [
      {
        id: 1,
        name: 'Математика',
      },
      {
        id: 2,
        name: 'Физика',
      },
    ],
  })
  readonly tags: ArticleTagEntity[];

  constructor(partial: Partial<ArticleEntity>) {
    Object.assign(this, partial);
  }
}
