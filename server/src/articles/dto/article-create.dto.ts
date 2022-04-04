import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ArticleTagDto } from '.';

export class ArticleCreateDto {
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({
    example: 'Научная статья по математике',
  })
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ArticleTagDto)
  @ApiProperty({
    type: ArticleTagDto,
    isArray: true,
    example: [
      {
        id: 1,
        name: 'Математика',
      },
      {
        name: 'Новый тэг',
      },
    ],
  })
  tags: ArticleTagDto[];

  @IsNotEmpty()
  @MaxLength(10000)
  @ApiProperty({
    example: 'Текст новой статьи',
  })
  content: string;
}
