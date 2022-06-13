import { BaseAbstractDto } from '@common/dto/response';
import { OlympiadTaskAnswerAttempt } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { OlympicTaskAnswerVariantFullDto } from '@olympics/dto/response/olympic-task-answer-variant-full.dto';
import { Type } from 'class-transformer';

export class OlympicTaskAnswerAttemptDto
  extends BaseAbstractDto
  implements OlympiadTaskAnswerAttempt
{
  @ApiProperty({
    description: 'Идентификатор задания',
    example: 1,
    type: 'integer',
  })
  readonly olympiadTaskId: number;

  @ApiProperty({
    description: 'Идентификатор попытки завершения этапа',
    example: 1,
    type: 'integer',
  })
  readonly olympiadStepAttemptId: number;

  @ApiProperty({
    description: 'Идентификатор студента',
    example: 1,
    type: 'integer',
  })
  readonly studentId: number;

  @ApiProperty({
    description: 'Успешность ответа',
    example: true,
    type: 'boolean',
  })
  readonly success: boolean;

  @ApiProperty({
    description: 'Варианты ответа',
    type: () => OlympicTaskAnswerVariantFullDto,
    isArray: true,
  })
  @Type(() => OlympicTaskAnswerVariantFullDto)
  readonly attempts: Array<OlympicTaskAnswerVariantFullDto>;

  constructor(partial: Partial<OlympicTaskAnswerAttemptDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
