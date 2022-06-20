import { OlympicListedBaseDto } from '@olympics/dto/response/olympic-listed-base.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OlympicListedMyDto extends OlympicListedBaseDto {
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

  @Expose()
  @ApiProperty({
    type: 'boolean',
    example: false,
    description: 'Олимпиада завершена',
  })
  get finished(): boolean {
    return this.steps.pop().finishDate < new Date();
  }

  constructor(partial: Partial<OlympicListedMyDto>) {
    super(partial);

    Object.assign(this, partial);
  }
}
