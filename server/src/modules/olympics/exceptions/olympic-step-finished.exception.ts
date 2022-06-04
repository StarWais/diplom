import { BadRequestException } from '@nestjs/common';

export class OlympicStepFinishedException extends BadRequestException {
  constructor(id: number) {
    super(`Этап олимпиады с идентификатором ${id} уже завершен`);
  }
}
