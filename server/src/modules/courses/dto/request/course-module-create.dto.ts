import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseModuleCreateDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Модуль 1',
    description: 'Название модуля',
  })
  readonly name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: 'Описание модуля 1',
    description: 'Описание модуля',
  })
  readonly description: string;
}
