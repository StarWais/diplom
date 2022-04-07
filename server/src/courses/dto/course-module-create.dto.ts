import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseModuleCreateDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Модуль 1',
  })
  readonly name: string;
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Описание модуля 1',
  })
  readonly description: string;
}
