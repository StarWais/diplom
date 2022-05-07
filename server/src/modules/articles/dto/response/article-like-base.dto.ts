import { ArticleLike } from '@prisma/client';

import { BaseAbstractDto } from '../../../../common/dto/response/base-abstract.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleLikeBaseDto extends BaseAbstractDto implements ArticleLike {
  @ApiProperty({
    description: 'ID статьи',
    example: 1,
    type: 'integer',
  })
  readonly articleId: number;

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
