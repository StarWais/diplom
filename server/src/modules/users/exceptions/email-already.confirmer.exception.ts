import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyConfirmedException extends BadRequestException {
  constructor() {
    super('Пользователю не требуется повторная отправка токена');
  }
}
