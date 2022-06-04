import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class OlympicTaskAnswerVariantCreateDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Правильный ли ответ',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly rightAnswer: boolean;

  @ApiProperty({
    type: 'string',
    description: 'Текст ответа',
    example: 'Ответ',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly text: string;
}
