import { BadRequestException } from '@nestjs/common';

export class StudentAlreadyAppliedException extends BadRequestException {
  constructor() {
    super('Вы уже подали заявку на указанный(е) шаг(и) выбранной олимпиады');
  }
}
