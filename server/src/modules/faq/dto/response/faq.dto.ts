import { BaseAbstractDto } from '@common/dto/response';
import { FAQQuestion } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FaqDto extends BaseAbstractDto implements FAQQuestion {
  @ApiProperty({
    type: 'string',
    description: 'Вопрос',
    example: 'Как оплатить курс?',
  })
  readonly question: string;

  @ApiProperty({
    type: 'string',
    description: 'Ответ',
    example: 'Оплатите по номеру ЕРИП',
  })
  readonly answer: string;

  constructor(partial: Partial<FaqDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
