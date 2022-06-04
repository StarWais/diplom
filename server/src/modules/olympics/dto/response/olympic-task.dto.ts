import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { OlympicTaskFullDto } from './olympic-task-full.dto';
import { OlympicTaskAnswerVariantDto } from './olympic-task-answer-variant.dto';

export class OlympicTaskDto extends OmitType(OlympicTaskFullDto, [
  'points',
  'variants',
] as const) {
  @Expose()
  @ApiProperty({
    type: () => OlympicTaskAnswerVariantDto,
    description: 'Варианты ответа',
  })
  @Type(() => OlympicTaskAnswerVariantDto)
  readonly variants: Array<OlympicTaskAnswerVariantDto>;

  constructor(partial: Partial<OlympicTaskDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
