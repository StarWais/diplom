import { BadRequestException } from '@nestjs/common';

export class OlympicStepNotStartedException extends BadRequestException {
  constructor(id: number) {
    super(`Этап олимпиады с идентификатором ${id} еще не начался`);
  }
}
