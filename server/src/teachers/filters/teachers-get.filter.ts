import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationQuery } from '../../common/pagination/pagination-query';

export class TeachersGetFilter extends PaginationQuery {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'программирование,математика',
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
