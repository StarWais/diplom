import { BadRequestException } from '@nestjs/common';

export class OlympicStepAttemptCreatedException extends BadRequestException {
  constructor(id: number) {
    super(`Вы уже начали прохождение этапа олимпиады с идентификатором ${id}`);
  }
}
