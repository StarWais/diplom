import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CourseApplicationCreateDto {
  @ApiProperty({
    example: 'Иванов Иван Иванович',
  })
  @IsNotEmpty()
  @MaxLength(150)
  readonly appliciantName: string;

  @ApiProperty({
    example: 'Иванов Иван Иванович',
  })
  @IsNotEmpty()
  @MaxLength(150)
  readonly appliciantPhone: string;
}
