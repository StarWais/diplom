import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationQuery } from '../../../common/pagination/pagination-query';

export class ArticlesGetFilter extends PaginationQuery {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
    description: 'ID автора статьи',
  })
  authorId?: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'математика,физика',
    type: 'string',
    required: false,
    description: 'Список тегов через запятую',
  })
  tags?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Статья такая-то',
    required: false,
    description: 'Текст поиска',
  })
  search?: string;
}
