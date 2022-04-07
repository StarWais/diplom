import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseStepCreateDto, CourseModuleCreateDto, CourseTagDto } from '.';

export class CourseCreateDto {
  @ApiProperty({
    example: 'Название курса',
  })
  @IsNotEmpty()
  @MaxLength(100)
  readonly name: string;

  @ApiProperty({
    example: '4 недели',
  })
  @IsNotEmpty()
  @MaxLength(100)
  readonly length: string;

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
    isArray: true,
    type: 'string',
    example: ['ссылка на материал 1', 'ссылка на материал 2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  readonly materials: string[];

  @ApiProperty({
    example: Date.now(),
    type: 'date-time',
  })
  readonly startDate: Date;

  @ApiProperty({
    isArray: true,
    type: CourseStepCreateDto,
    example: [
      {
        step: 1,
        title: 'Начало курса',
        text: 'Описание начала курса',
      },
    ],
  })
  @IsArray({ each: true })
  @Type(() => CourseStepCreateDto)
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  readonly steps: CourseStepCreateDto[];

  @ApiProperty({
    isArray: true,
    type: CourseModuleCreateDto,
    example: [
      {
        name: 'Модуль 1',
        description: 'Описание модуля 1',
      },
    ],
  })
  @IsArray({ each: true })
  @Type(() => CourseModuleCreateDto)
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  readonly modules: CourseModuleCreateDto[];

  @ApiProperty({
    isArray: true,
    type: CourseTagDto,
    example: [
      {
        name: 'Математика',
      },
    ],
  })
  @IsArray({ each: true })
  @Type(() => CourseTagDto)
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  readonly tags: CourseTagDto[];

  @ApiProperty({
    example: '12367yfhu23njn',
  })
  @IsNotEmpty()
  @MaxLength(100)
  readonly eripNumber: string;
}
