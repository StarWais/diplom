import { ApiProperty } from '@nestjs/swagger';

export class ArticleLikeEntity {
  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  id: number;
  @ApiProperty({
    example: 3,
    type: 'integer',
  })
  userId: number;
}
