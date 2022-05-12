import { BadRequestException } from '@nestjs/common';

export class EmailUserExistsException extends BadRequestException {
  constructor(email: string) {
    super(`Пользователь с почтовым адресом ${email} уже существует`);
  }
}
