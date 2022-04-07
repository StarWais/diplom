import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive, IsOptional, IsInt } from 'class-validator';
import { PaginationQuery } from '../../common/pagination/pagination-query';

export class CoursesGetFilter extends PaginationQuery {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  grade?: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'tag1,tag2',
    type: 'string',
    required: false,
  })
  tags?: string[];
}
