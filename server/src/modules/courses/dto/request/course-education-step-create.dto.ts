import { IsInt, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseEducationStepCreateDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Название шага',
    description: 'Название шага',
  })
  readonly title: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Текст шага',
    description: 'Описание шага',
  })
  readonly description: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
    type: 'integer',
    description: 'Порядковый номер шага',
  })
  readonly step: number;
}
