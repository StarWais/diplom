import { BadRequestException } from '@nestjs/common';

export class UserAlreadyTeacherException extends BadRequestException {
  constructor(userId: number) {
    super(`Пользователь с идентификатором ${userId} уже является учителем.`);
  }
}
