import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { OlympicTaskAnswerAttemptCreateDto } from './olympic-task-answer-attempt-create.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OlympicStepAttemptCreateDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => OlympicTaskAnswerAttemptCreateDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    description: 'Ответы пользователя',
    type: () => OlympicTaskAnswerAttemptCreateDto,
    isArray: true,
  })
  readonly taskAttempts: Array<OlympicTaskAnswerAttemptCreateDto>;
}
