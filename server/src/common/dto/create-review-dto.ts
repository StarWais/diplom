import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'Текст отзыва',
  })
  @IsNotEmpty()
  @MaxLength(700)
  readonly text: string;
}
