import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userIdentifier: number | string) {
    super(`Пользователь с идентификатором ${userIdentifier} не найден`);
  }
}
