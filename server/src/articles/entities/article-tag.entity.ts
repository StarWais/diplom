import { ApiProperty } from '@nestjs/swagger';
import { ArticleTag } from '@prisma/client';

export class ArticleTagEntity implements ArticleTag {
  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  readonly id: number;
  @ApiProperty({
    example: 'Математика',
  })
  readonly name: string;
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
}
