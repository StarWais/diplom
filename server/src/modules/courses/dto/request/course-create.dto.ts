import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

import {
  CourseEducationStepCreateDto,
  CourseModuleCreateDto,
  CourseTagCreateDto,
} from './index';

export class CourseCreateDto {
  @ApiProperty({
    example: 'Курс по программированию',
    description: 'Название курса',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly name: string;

  @ApiProperty({
    example: 5,
    type: 'integer',
    description: 'Вместимость курса',
  })
  @IsInt()
  @IsPositive()
  readonly capacity: number;

  @ApiProperty({
    example: 5,
    type: 'integer',
    description: 'Идентификатор преподавателя',
  })
  @IsInt()
  @IsPositive()
  readonly teacherId: number;

  @ApiProperty({
    example: 11,
    type: 'integer',
    description: 'Класс курса',
  })
  @IsInt()
  @IsPositive()
  readonly grade: number;

  @ApiProperty({
    example: 11,
    type: 'integer',
    description: 'Стоимость курса',
  })
  @IsInt()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    isArray: true,
    type: 'string',
    example: ['Cтудентам', 'Преподавателям'],
    description: 'Кому этот курс подходит',
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  readonly toWhom: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
    example: ['Возможность 1', 'Возможность 2'],
    description: 'Возможности курса',
  })
  @IsArray()
  @ArrayMinSize(1)
  readonly possibilities: string[];

  @ApiProperty({
    example: 'https://example.com/materials.zip',
    type: 'string',
    description: 'Ссылка на материалы',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  readonly materialsLink: string;

  @ApiProperty({
    example: 12,
    type: 'integer',
    description: 'Кол-во материалов курса',
  })
  @IsInt()
  @IsPositive()
  readonly materialsCount: number;

  @ApiProperty({
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
    description: 'Дата начала курса',
  })
  @IsNotEmpty()
  @IsDate()
  readonly startDate: Date;

  @ApiProperty({
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
    description: 'Дата окончания курса',
  })
  @IsNotEmpty()
  @IsDate()
  readonly finishDate: Date;

  @ApiProperty({
    isArray: true,
    type: () => CourseEducationStepCreateDto,
    description: 'Этапы обучения',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseEducationStepCreateDto)
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  readonly steps: CourseEducationStepCreateDto[];

  @ApiProperty({
    isArray: true,
    type: () => CourseModuleCreateDto,
    description: 'Модули курса',
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
    description: 'Теги курса',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseTagCreateDto)
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  readonly tags: CourseTagCreateDto[];

  @ApiProperty({
    example: '12367yfhu23njn',
    description: 'Номер ЕРИП',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly eripNumber: string;

  @ApiProperty({
    type: 'file',
    description: 'Картинка курса',
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

  constructor(partial: Partial<CourseCreateDto>) {
    Object.assign(this, partial);
  }
}
