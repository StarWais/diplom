import { BadRequestException } from '@nestjs/common';

export class InvalidOldPasswordException extends BadRequestException {
  constructor() {
    super('Старый пароль введен неверно');
  }
}
