import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max } from 'class-validator';

export class RateTeacherDto {
  @ApiProperty({
    example: 5,
    type: 'integer',
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(5)
  readonly rating: number;
}
