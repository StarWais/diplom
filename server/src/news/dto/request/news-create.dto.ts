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
import { CourseTagDto } from '../../../courses/dto/request';
import { Type } from 'class-transformer';
import { NewsTagCreateDto } from './news-tag-create.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class NewsCreateDto {
  @ApiProperty({
    example: 'Новость о новом курсе',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10000)
  @ApiProperty({
    example: 'Новая новость о новом курсе...',
    required: true,
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    example: 'Описание новости о новом курсе...',
    required: true,
  })
  description: string;

  @ApiProperty({
    isArray: true,
    type: () => CourseTagDto,
    example: [
      {
        name: 'математика',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewsTagCreateDto)
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  readonly tags: NewsTagCreateDto[];

  @ApiProperty({
    type: 'file',
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
  image: FileSystemStoredFile;
}
