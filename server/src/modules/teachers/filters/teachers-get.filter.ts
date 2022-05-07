import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { PaginationQuery } from '../../../common/pagination/pagination-query';

export class TeachersGetFilter extends PaginationQuery {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @ApiProperty({
    example: 'программирование,математика',
    isArray: true,
    type: 'string',
    required: false,
  })
  categories?: string[];

  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'текст поиска',
    required: false,
  })
  search?: string;
}
