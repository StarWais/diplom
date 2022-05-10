import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';

export class OlympicStepDto extends BaseAbstractDto {
  @ApiProperty({
    description: 'Название этапа',
    type: 'string',
    example: 'Основной тур',
  })
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
  readonly startDate: Date;

  @ApiProperty({
    description: 'Конец проведения этапа',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly finishDate: Date;

  @ApiProperty({
    description: 'Номер этапа',
    type: 'integer',
    example: 1,
  })
  readonly step: number;
}
