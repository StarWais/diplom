import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NewsGetFilter extends PaginationQuery {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Новость',
    required: false,
  })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'курсы,преподаватели',
    type: 'string',
    required: false,
  })
  tags?: string[];
}
