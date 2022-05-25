import { NotFoundException } from '@nestjs/common';

export class FaqNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Вопрос с идентификатором ${id} не найден`);
  }
}
