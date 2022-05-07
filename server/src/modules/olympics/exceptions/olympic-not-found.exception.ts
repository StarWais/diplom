import { NotFoundException } from '@nestjs/common';

export class OlympicNotFoundException extends NotFoundException {
  constructor(olympicUniqueId: number) {
    super(`Олимпиада с идентификатором ${olympicUniqueId} не найдена`);
  }
}
