import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateTeacherDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 1,
  })
  readonly userId: number;
}
