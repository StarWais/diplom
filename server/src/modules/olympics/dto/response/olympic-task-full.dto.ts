import { BaseAbstractDto } from '@common/dto/response';
import { OlympiadTask, OlympiadTaskAnswerType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { OlympicTaskAnswerVariantFullDto } from '@olympics/dto/response/olympic-task-answer-variant-full.dto';

export class OlympicTaskFullDto
  extends BaseAbstractDto
  implements OlympiadTask
{
  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'Идентификатор этапа олимпиады',
    example: 1,
  })
  readonly olympiadStepId: number;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Название задания',
    example: 'Выберите что из этого является правдой',
  })
  readonly task: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Описание задания',
    example: 'За данный вопрос можно получить много баллов',
    nullable: true,
  })
  readonly description: string | null;

  @Expose()
  @ApiProperty({
    type: 'integer',
    description: 'Кол-во баллов за правильный ответ',
    example: 10,
  })
  readonly points: number;

  @Expose()
  @ApiProperty({
    enum: OlympiadTaskAnswerType,
    example: OlympiadTaskAnswerType.SINGLE_CHOICE,
    description: 'Тип ответа',
  })
  readonly answerType: OlympiadTaskAnswerType;

  @Expose()
  @ApiProperty({
    type: () => OlympicTaskAnswerVariantFullDto,
    description: 'Варианты ответа',
  })
  @Type(() => OlympicTaskAnswerVariantFullDto)
  readonly variants: Array<OlympicTaskAnswerVariantFullDto>;

  constructor(partial: Partial<OlympicTaskFullDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
