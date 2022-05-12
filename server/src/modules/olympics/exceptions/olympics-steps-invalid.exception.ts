import { BadRequestException } from '@nestjs/common';

export class OlympicsStepsInvalidException extends BadRequestException {
  constructor() {
    super('Несуществующие шаги в олимпиаде');
  }
}
