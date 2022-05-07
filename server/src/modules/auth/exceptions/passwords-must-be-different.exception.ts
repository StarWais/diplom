import { BadRequestException } from '@nestjs/common';

export class PasswordsMustBeDifferentException extends BadRequestException {
  constructor() {
    super('Новый пароль должен отличаться от старого');
  }
}
