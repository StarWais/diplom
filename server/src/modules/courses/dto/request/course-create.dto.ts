import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CourseModuleCreateDto,
  CourseStepCreateDto,
  CourseTagCreateDto,
} from './index';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class CourseCreateDto {
  @ApiProperty({
    example: 'Название курса',
  })
  @IsNotEmpty()
  @MaxLength(100)
  readonly name: string;

  @ApiProperty({
    example: 5,
    type: 'integer',
  })
  @IsInt()
  @IsPositive()
  readonly capacity: number;

  @ApiProperty({
    example: 5,
    type: 'integer',
  })
  @IsInt()
  @IsPositive()
  readonly teacherId: number;

  @ApiProperty({
    example: 11,
    type: 'integer',
  })
  @IsInt()
  @IsPositive()
  readonly grade: number;

  @ApiProperty({
    example: 11,
    type: 'integer',
  })
  @IsInt()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    isArray: true,
    type: 'string',
    example: ['Cтудентам', 'Преподавателям'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  readonly toWhom: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
    example: ['Возможность 1', 'Возможность 2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  readonly possibilities: string[];

  @ApiProperty({
    example: 'https://example.com/materials.zip',
  })
  @IsNotEmpty()
  @Length(1, 255)
  readonly materialsLink: string;

  @ApiProperty({
    example: 12,
  })
  @IsInt()
  @IsPositive()
  readonly materialsCount: number;

  @ApiProperty({
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  readonly startDate: Date;

  @ApiProperty({
    example: Date.now(),
    type: 'date-time',
  })
  @IsNotEmpty()
  @IsDate()
  readonly finishDate: Date;

  @ApiProperty({
    isArray: true,
    type: () => CourseStepCreateDto,
    example: [
      {
        step: 1,
        title: 'Начало курса',
        text: 'Описание начала курса',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseStepCreateDto)
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  readonly steps: CourseStepCreateDto[];

  @ApiProperty({
    isArray: true,
    type: () => CourseModuleCreateDto,
    example: [
      {
        name: 'Модуль 1',
        description: 'Описание модуля 1',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseModuleCreateDto)
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  readonly modules: CourseModuleCreateDto[];

  @ApiProperty({
    isArray: true,
    type: () => CourseTagCreateDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseTagCreateDto)
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  readonly tags: CourseTagCreateDto[];

  @ApiProperty({
    example: '12367yfhu23njn',
  })
  @IsNotEmpty()
  @MaxLength(100)
  readonly eripNumber: string;

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
