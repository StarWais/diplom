import {
  EmailChangeToken,
  PasswordResetToken,
  RegistrationToken,
  TokenStatus,
} from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isAfter, isBefore } from 'date-fns';

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

  static compareDatesWithoutTime(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  static checkIfDateIsInRange(
    startDate: Date,
    finishDate: Date,
    date: Date,
  ): boolean {
    return !(isAfter(date, startDate) || isBefore(date, finishDate));
  }
}
