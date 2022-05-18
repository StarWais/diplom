import { ApiProperty } from '@nestjs/swagger';

import { OlympiadStep } from '@prisma/client';
import { Expose } from 'class-transformer';

import { BaseAbstractDto } from '../../../../common/dto/response';

export class OlympicStepDto extends BaseAbstractDto implements OlympiadStep {
  @Expose()
  @ApiProperty({
    description: 'ID олимпиады',
    type: 'integer',
    example: 1,
  })
  readonly olympiadId: number;

  @Expose()
  @ApiProperty({
    description: 'Название этапа',
    type: 'string',
    example: 'Основной тур',
  })
  readonly name: string;

  @Expose()
  @ApiProperty({
    description: 'Описание этапа',
    type: 'string',
    example: 'Это описание этапа',
  })
  readonly description: string;

  @Expose()
  @ApiProperty({
    description: 'Начало проведения этапа',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly startDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Конец проведения этапа',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly finishDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Номер этапа',
    type: 'integer',
    example: 1,
  })
  readonly step: number;
}
