import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class FindByArticleIdParams {
  @ApiProperty({
    description: 'ID статьи',
    example: 2,
    type: 'integer',
  })
  @IsInt()
  @IsPositive()
  readonly articleId: number;
}
