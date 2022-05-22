import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

import { CourseTagCreateDto } from '@courses/dto/request';
import { NewsTagCreateDto } from './news-tag-create.dto';

export class NewsCreateDto {
  @ApiProperty({
    example: 'Новость о новом курсе',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10000)
  @ApiProperty({
    example: 'Новая новость о новом курсе...',
    required: true,
  })
  readonly content: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    example: 'Описание новости о новом курсе...',
    required: true,
  })
  readonly description: string;

  @ApiProperty({
    isArray: true,
    type: CourseTagCreateDto,
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => NewsTagCreateDto)
  readonly tags: Array<NewsTagCreateDto>;

  @ApiProperty({
    type: 'file',
    required: true,
  })
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
  ])
  readonly image: FileSystemStoredFile;
}
