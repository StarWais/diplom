import { ApiProperty } from '@nestjs/swagger';
import { ArticleTag } from '@prisma/client';
import { CreatedUpdatedEntity } from '../../common/entities/created-updated-entity';

export class ArticleTagEntity
  extends CreatedUpdatedEntity
  implements ArticleTag
{
  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  readonly id: number;
  @ApiProperty({
    example: 'Математика',
  })
  readonly name: string;

  constructor(data: Partial<ArticleTagEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
