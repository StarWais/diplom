import { BadRequestException } from '@nestjs/common';

export class OlympicStepAttemptNotCreatedException extends BadRequestException {
  constructor(id: number) {
    super(
      `Вы еще не начали прохождение этапа олимпиады с идентификатором ${id}`,
    );
  }
}
