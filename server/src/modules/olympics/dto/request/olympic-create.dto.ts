import { OlympiadParticipationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

import { OlympicStepCreateDto } from './olympic-step-create.dto';
import { OlympicTagCreateDto } from './olympic-tag-create.dto';

export class OlympicCreateDto {
  @ApiProperty({
    description: 'Название олимпиады',
    example: 'Олимпиада по информатике',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly name: string;

  @ApiProperty({
    description: 'Формат олимпиады',
    example: 'Дистанционно',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly format: string;

  @ApiProperty({
    description: 'Тип олимпиады',
    example: OlympiadParticipationType.FREE,
    enum: OlympiadParticipationType,
  })
  @IsNotEmpty()
  @IsEnum(OlympiadParticipationType)
  readonly participationType: OlympiadParticipationType;

  @ApiProperty({
    description: 'Класс олимпиады',
    example: 10,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Max(11)
  readonly grade: number;

  @ApiProperty({
    description: 'Массив картинок предыдущих этапов олимпиады',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    isArray: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsArray({
    each: true,
  })
  readonly exampleTasksImages: string[];

  @ApiProperty({
    description: 'Награды олимпиады',
    isArray: true,
    type: 'string',
    example: ['Награда1', 'Награда2', 'Награда3'],
  })
  @IsNotEmpty()
  @IsArray({ each: true })
  readonly rewards: string[];

  @ApiProperty({
    isArray: true,
    type: () => OlympicTagCreateDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OlympicTagCreateDto)
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  readonly tags: OlympicTagCreateDto[];

  @ApiProperty({
    description: 'Массив этапов олимпиады',
    isArray: true,
    type: () => OlympicStepCreateDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Transform(({ value }) =>
    value.map(
      (step, index) => new OlympicStepCreateDto({ ...step, step: index + 1 }),
    ),
  )
  readonly steps: OlympicStepCreateDto[];

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
  readonly image: FileSystemStoredFile;
}
