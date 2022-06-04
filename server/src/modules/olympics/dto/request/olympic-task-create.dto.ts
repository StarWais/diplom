import { OlympiadTaskAnswerType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class OlympicTaskCreateDto {
  @ApiProperty({
    type: 'string',
    description: 'Название задания',
    example: 'Выберите что из этого является правдой',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly task: string;

  @ApiProperty({
    type: 'string',
    description: 'Описание задания',
    example: 'За данный вопрос можно получить много баллов',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly description?: string;

  @ApiProperty({
    type: 'integer',
    description: 'Кол-во баллов за правильный ответ',
    example: 10,
  })
  @IsInt()
  @IsPositive()
  @Max(100)
  readonly points: number;

  @ApiProperty({
    enum: OlympiadTaskAnswerType,
    example: OlympiadTaskAnswerType.SINGLE_CHOICE,
    description: 'Тип ответа',
  })
  @IsEnum(OlympiadTaskAnswerType)
  readonly answerType: OlympiadTaskAnswerType;
}
