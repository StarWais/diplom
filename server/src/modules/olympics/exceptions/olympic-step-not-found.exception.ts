import { NotFoundException } from '@nestjs/common';

export class OlympicStepNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Этап олимпиады с идентификатором ${id} не найден`);
  }
}
