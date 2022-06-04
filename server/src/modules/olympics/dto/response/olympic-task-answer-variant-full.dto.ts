import { BaseAbstractDto } from '@common/dto/response';
import { OlympiadTaskAnswerVariant } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OlympicTaskAnswerVariantFullDto
  extends BaseAbstractDto
  implements OlympiadTaskAnswerVariant
{
  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Идентификатор задания',
    example: 1,
  })
  readonly olympiadTaskId: number;

  @Expose()
  @ApiProperty({
    type: 'boolean',
    description: 'Правильный ли ответ',
    example: true,
  })
  readonly rightAnswer: boolean;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Текст ответа',
    example: 'Ответ',
  })
  readonly text: string;

  constructor(partial: Partial<OlympicTaskAnswerVariantFullDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
