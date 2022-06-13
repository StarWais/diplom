import { BaseAbstractDto } from '@common/dto/response';
import { OlympiadStepAttempt } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { OlympicTaskAnswerAttemptDto } from '@olympics/dto/response/olympic-task-answer-attempt.dto';
import { Type } from 'class-transformer';

export class OlympicStepAttemptDto
  extends BaseAbstractDto
  implements OlympiadStepAttempt
{
  @ApiProperty({
    description: 'Идентификатор этапа',
    example: 1,
    type: 'integer',
  })
  readonly olympiadStepId: number;

  @ApiProperty({
    description: 'Идентификатор студента',
    example: 1,
    type: 'integer',
  })
  readonly studentId: number;

  @ApiProperty({
    description: 'Ответы пользователя',
    type: () => OlympicTaskAnswerAttemptDto,
    isArray: true,
  })
  @Type(() => OlympicTaskAnswerAttemptDto)
  readonly attempts: Array<OlympicTaskAnswerAttemptDto>;

  constructor(partial: Partial<OlympicStepAttemptDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
