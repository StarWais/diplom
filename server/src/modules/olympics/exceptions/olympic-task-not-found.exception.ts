import { NotFoundException } from '@nestjs/common';

export class OlympicTaskNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Задание этапа олимпиады с идентификатором ${id} не найдено`);
  }
}
