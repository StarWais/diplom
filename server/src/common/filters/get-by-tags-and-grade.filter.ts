import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PaginationQuery } from '@pagination/pagination-query';

export class GetByTagsAndGradeFilter extends PaginationQuery {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
    description: 'Класс',
  })
  readonly grade?: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'tag1,tag2',
    type: 'string',
    required: false,
    description: 'Список тегов через запятую',
  })
  readonly tags?: string[];
}
