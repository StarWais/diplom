import {
  PasswordResetToken,
  RegistrationToken,
  TokenStatus,
  EmailChangeToken,
} from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class HelpersMethods {
  static checkToken<
    T extends PasswordResetToken | RegistrationToken | EmailChangeToken,
  >(token: T): T {
    if (!token) {
      throw new NotFoundException('Токен не найден');
    }
    if (token.expiresIn.getTime() < Date.now()) {
      throw new BadRequestException('Токен просрочен');
    }
    if (token.status === TokenStatus.FULFILLED) {
      throw new BadRequestException('Токен уже использован');
    }
    return token;
  }
}
