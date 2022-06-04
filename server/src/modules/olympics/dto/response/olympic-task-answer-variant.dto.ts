import { OmitType } from '@nestjs/swagger';
import { OlympicTaskAnswerVariantFullDto } from '@olympics/dto/response/olympic-task-answer-variant-full.dto';

export class OlympicTaskAnswerVariantDto extends OmitType(
  OlympicTaskAnswerVariantFullDto,
  ['rightAnswer'] as const,
) {}
