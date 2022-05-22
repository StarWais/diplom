import { ArticleLike } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BaseAbstractDto } from '@common/dto/response';

export class ArticleLikeBaseDto extends BaseAbstractDto implements ArticleLike {
  @Expose()
  @ApiProperty({
    description: 'ID статьи',
    example: 1,
    type: 'integer',
  })
  readonly articleId: number;

  @Expose()
  @ApiProperty({
    description: 'ID пользователя',
    example: 1,
    type: 'integer',
  })
  readonly userId: number;

  constructor(partial: Partial<ArticleLikeBaseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
