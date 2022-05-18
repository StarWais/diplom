import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { OlympiadStep } from '@prisma/client';

import { OlympicDto } from './olympic.dto';

export class OlympicListedBaseDto extends PickType(OlympicDto, [
  'id',
  'name',
  'imageLink',
] as const) {
  @Exclude()
  readonly steps: OlympiadStep[];

  @Expose()
  @ApiProperty({
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
    description: 'Старт проведения олимпиады',
  })
  get startDate(): Date {
    return this.steps[0].startDate;
  }

  @Expose()
  @ApiProperty({
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
    description: 'Конец проведения олимпиады',
  })
  get finishDate(): Date {
    return this.steps.pop().finishDate;
  }

  constructor(partial: Partial<OlympicListedBaseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
