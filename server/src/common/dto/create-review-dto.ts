import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateReviewDto {
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
  readonly rating: number;
}
