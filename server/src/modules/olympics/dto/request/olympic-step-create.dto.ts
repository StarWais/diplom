import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class OlympicStepCreateDto {
  @ApiProperty({
    description: 'Название этапа',
    type: 'string',
    example: 'Основной тур',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  readonly name: string;

  @ApiProperty({
    description: 'Описание этапа',
    type: 'string',
    example: 'Это описание этапа',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Начало проведения этапа',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  readonly startDate: Date;

  @ApiProperty({
    description: 'Конец проведения этапа',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  readonly finishDate: Date;

  @ApiProperty({
    description: 'Номер этапа',
    type: 'number',
    example: 1,
  })
  readonly step: number;

  constructor(partial: Partial<OlympicStepCreateDto>) {
    Object.assign(this, partial);
  }
}
