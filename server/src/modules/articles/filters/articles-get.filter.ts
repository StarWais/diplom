import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

import { PaginationQuery } from '@pagination/pagination-query';

export class ArticlesGetFilter extends PaginationQuery {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
    description: 'ID автора статьи',
  })
  readonly authorId?: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'математика,физика',
    type: 'string',
    required: false,
    description: 'Список тегов через запятую',
  })
  readonly tags?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Статья такая-то',
    required: false,
    description: 'Текст поиска',
  })
  readonly search?: string;
}
