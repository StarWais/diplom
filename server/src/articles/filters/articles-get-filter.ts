import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsOptional } from 'class-validator';
import { PaginationQuery } from '../../common/pagination/pagination-query';
export class ArticlesGetFilter extends PaginationQuery {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  authorId?: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'tag1,tag2',
    type: 'string',
    required: false,
  })
  tags?: string[];

  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'текст поиска',
    required: false,
  })
  search?: string;
}
