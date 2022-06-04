import { NotFoundException } from '@nestjs/common';

export class OlympicTaskAnswerVariantNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Вариант решения задания с идентификатором ${id} не найден`);
  }
}
