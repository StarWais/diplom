import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { ArticleTagCreateDto } from './index';

export class ArticleCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ApiProperty({
    example: 'Научная статья по математике',
    description: 'Заголовок статьи',
  })
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => ArticleTagCreateDto)
  @ApiProperty({
    type: () => [ArticleTagCreateDto],
    isArray: true,
    description: 'Теги статьи',
  })
  tags: ArticleTagCreateDto[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  @ApiProperty({
    example: 'Текст новой статьи',
    description: 'Текст статьи',
  })
  content: string;
}
