import { ArticleComment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';
import { ArticleCommentAuthorDto } from './article-comment-author.dto';

export class ArticleCommentDto
  extends BaseAbstractDto
  implements ArticleComment
{
  @ApiProperty({
    description: 'ID статьи',
    type: 'integer',
    example: 2,
  })
  readonly articleId: number;

  @ApiProperty({
    description: 'ID автора статьи',
    type: 'integer',
    example: 1,
  })
  readonly authorId: number;

  @ApiProperty({
    description: 'Текст комментария',
    type: 'string',
    example: 'Эта статья просто не понравилась',
  })
  readonly text: string;

  @ApiProperty({
    description: 'Автор комментария',
    type: () => ArticleCommentAuthorDto,
  })
  readonly author: ArticleCommentAuthorDto;

  constructor(partial: Partial<ArticleCommentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
