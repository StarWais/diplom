import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  MaxLength,
} from 'class-validator';

export class ReviewCreateDto {
  @ApiProperty({
    example: 'Текст отзыва',
  })
  @IsNotEmpty()
  @MaxLength(700)
  readonly text: string;

  @ApiProperty({
    example: 5,
    type: 'integer',
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(5)
  readonly rating: number;
}
