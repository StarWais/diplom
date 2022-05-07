import { PickType } from '@nestjs/swagger';

import { OlympicDto } from './olympic.dto';

export class OlympicListedAllDto extends PickType(OlympicDto, [
  'id',
  'name',
] as const) {}
