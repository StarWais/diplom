import { BadRequestException } from '@nestjs/common';

export class OlympicStepNotAttendedException extends BadRequestException {
  constructor(stepId: number) {
    super(`Вы не записаны на этап олимпиады с идентификатором ${stepId}`);
  }
}
