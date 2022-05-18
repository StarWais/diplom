import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordResetToken, Prisma, TokenStatus, User } from '@prisma/client';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import {
  ConfirmationTokenOptions,
  DomainOptions,
} from '../../../config/configuration';
import { HelpersMethods } from '../../../common/helpers/helpers.methods';
import { ConfirmPasswordResetDto, PasswordResetDto } from '../dto/request';
import { PasswordsMustBeDifferentException } from '../exceptions';
import { UsersService } from '../../users/services';
import { BrowserInfo } from '../../../common/decorators/browser-info.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class AuthResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  private async sendPasswordResetEmail(
    user: User,
    token: PasswordResetToken,
  ): Promise<void> {
    const { email, firstName, middleName, lastName } = user;
    const { ip, browser, createdAt } = token;
    return this.mailerService.sendMail({
      to: email,
      subject: 'Восстановление пароля',
      template: 'reset-password',
      context: {
        title: 'Восстановление пароля',
        linkButtonText: 'Восстановить пароль',
        fullName: `${lastName} ${firstName} ${middleName}`,
        ip,
        browser,
        date: format(createdAt, 'dd MMMM yyyy', { locale: ru }),
        time: format(createdAt, 'HH:mm', { locale: ru }),
        linkButtonLink: `${
          this.config.get<DomainOptions>('domainOptions').frontend
        }/confirm-password-reset/${token.token}`,
      },
    });
  }

  private async validatePasswordResetToken(
    tokenValue: string,
  ): Promise<PasswordResetToken> {
    const tokenInfo = await this.prisma.passwordResetToken.findUnique({
      where: { token: tokenValue },
    });
    return HelpersMethods.checkToken(tokenInfo);
  }

  async confirmPasswordReset(details: ConfirmPasswordResetDto): Promise<void> {
    const { token: tokenValue, newPassword } = details;
    const token = await this.validatePasswordResetToken(tokenValue);
    const user = await this.usersService.findUniqueOrThrowError({
      id: token.userId,
    });

    const compareNewPassword = await AuthService.comparePassword(
      newPassword,
      user.password,
    );
    if (compareNewPassword) {
      throw new PasswordsMustBeDifferentException();
    }

    await this.prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { status: TokenStatus.FULFILLED },
    });
    const hashedNewPassword = await AuthService.hashPassword(newPassword);
    await this.usersService.updatePassword(
      {
        id: user.id,
      },
      hashedNewPassword,
    );
  }

  async resetPassword(
    details: PasswordResetDto,
    browserInfo: BrowserInfo,
  ): Promise<void> {
    const { email } = details;
    const user = await this.usersService.findUniqueOrThrowError({ email });
    await this.disableOtherPasswordResetTokens(user.id);
    const token = await this.createPasswordResetToken({
      user: {
        connect: {
          id: user.id,
        },
      },
      ...browserInfo,
    });
    return this.sendPasswordResetEmail(user, token);
  }

  private async disableOtherPasswordResetTokens(userId: number): Promise<void> {
    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId,
        expiresIn: { gt: new Date(Date.now()) },
      },
      data: {
        expiresIn: new Date(Date.now() - 1),
      },
    });
  }

  private async createPasswordResetToken(
    details: Omit<Prisma.PasswordResetTokenCreateInput, 'token' | 'expiresIn'>,
  ): Promise<PasswordResetToken> {
    const { length: tokenLength, expiresIn: tokenExpiresIn } =
      this.config.get<ConfirmationTokenOptions>(
        'authOptions.passwordResetTokenOptions',
      );
    const tokenValue = crypto.randomBytes(tokenLength).toString('hex');
    return this.prisma.passwordResetToken.create({
      data: {
        token: tokenValue,
        expiresIn: new Date(tokenExpiresIn + Date.now()),
        ...details,
      },
    });
  }
}
