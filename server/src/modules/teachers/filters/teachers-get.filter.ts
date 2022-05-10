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
    description: 'Список категорий через запятую',
    type: 'string',
    required: false,
  })
  categories?: string[];

  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Иван',
    description: 'Текст поиска',
    required: false,
  })
  search?: string;
}
