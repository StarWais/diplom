import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { OlympicTaskAnswerAttemptCreateDto } from './olympic-task-answer-attempt-create.dto';

export class OlympicStepAttemptCreateDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => OlympicTaskAnswerAttemptCreateDto)
  @ValidateNested({ each: true })
  readonly taskAttempts: Array<OlympicTaskAnswerAttemptCreateDto>;
}
