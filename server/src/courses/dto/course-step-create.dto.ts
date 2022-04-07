import { IsInt, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseStepCreateDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Название шага',
  })
  readonly title: string;
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Текст шага',
  })
  readonly text: string;
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  readonly step: number;
}
