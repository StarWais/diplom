import { BadRequestException } from '@nestjs/common';

export class UserAlreadyConfirmedException extends BadRequestException {
  constructor() {
    super('Пользователь уже подтвержден');
  }
}
