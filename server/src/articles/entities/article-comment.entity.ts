import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { ArticleComment } from '@prisma/client';

import { UserEntity } from '../../users/entities';
import { CreatedUpdatedEntity } from '../../common/entities';

export class ArticleCommentEntity
  extends CreatedUpdatedEntity
  implements ArticleComment
{
  @ApiProperty({
    type: 'integer',
    example: 4,
  })
  id: number;
  @ApiProperty({
    type: 'integer',
    example: 12,
  })
  articleId: number;
  @ApiProperty({
    type: 'integer',
    example: 13,
  })
  authorId: number;
  @ApiProperty({
    type: PickType(PartialType(UserEntity), [
      'firstName',
      'lastName',
      'middleName',
      'avatar',
      'fullName',
    ] as const),
  })
  author: Pick<
    Partial<UserEntity>,
    'firstName' | 'lastName' | 'middleName' | 'avatar' | 'fullName'
  >;
  @ApiProperty({
    example: 'Текст коментария',
  })
  text: string;

  constructor(data: Partial<ArticleCommentEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
