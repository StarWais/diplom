import { BadRequestException } from '@nestjs/common';

export class OlympicStepsInvalidException extends BadRequestException {
  constructor() {
    super('Несуществующие шаги в олимпиаде');
  }
}
