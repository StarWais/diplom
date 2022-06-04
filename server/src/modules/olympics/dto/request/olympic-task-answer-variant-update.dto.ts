import { PartialType } from '@nestjs/swagger';

import { OlympicTaskAnswerVariantCreateDto } from './olympic-task-answer-variant-create.dto';

export class OlympicTaskAnswerVariantUpdateDto extends PartialType(
  OlympicTaskAnswerVariantCreateDto,
) {}
