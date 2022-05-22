import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationQuery } from '@pagination/pagination-query';

export class NewsGetFilter extends PaginationQuery {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Новость',
    required: false,
  })
  readonly search?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @ApiProperty({
    example: 'курсы,преподаватели',
    type: 'string',
    required: false,
  })
  readonly tags?: string[];
}
