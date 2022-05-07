import { Injectable } from '@nestjs/common';
import { Prisma, RegistrationToken, TokenStatus, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import crypto from 'crypto';

import {
  ConfirmationTokenOptions,
  DomainOptions,
} from '../../../config/configuration';
import { BrowserInfo } from '../../../common/decorators/browser-info.decorator';
import { UserAlreadyConfirmedException } from '../exceptions';
import { ConfirmEmailDto } from '../dto/request';
import { HelpersMethods } from '../../../common/helpers/helpers.methods';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthConfirmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  private async createRegistrationToken(
    details: Omit<Prisma.RegistrationTokenCreateInput, 'token' | 'expiresIn'>,
  ): Promise<RegistrationToken> {
    const { length: tokenLength, expiresIn: tokenExpiresIn } =
      this.config.get<ConfirmationTokenOptions>(
        'authOptions.registrationTokenOptions',
      );
    const tokenValue = crypto.randomBytes(tokenLength).toString('hex');
    return this.prisma.registrationToken.create({
      data: {
        token: tokenValue,
        expiresIn: new Date(tokenExpiresIn + Date.now()),
        ...details,
      },
    });
  }

  async sendAnotherRegistrationToken(
    user: User,
    browserInfo: BrowserInfo,
  ): Promise<void> {
    if (user.confirmed) {
      throw new UserAlreadyConfirmedException();
    }
    await this.disableOtherRegistrationTokens(user.id);
    return this.createSendRegistrationToken(user, browserInfo);
  }

  async createSendRegistrationToken(
    user: User,
    browserInfo: BrowserInfo,
  ): Promise<void> {
    const token = await this.createRegistrationToken({
      user: {
        connect: {
          id: user.id,
        },
      },
      ...browserInfo,
    });
    await this.sendRegistrationConfirmationEmail(user.email, token.token);
  }

  private async disableOtherRegistrationTokens(userId: number): Promise<void> {
    await this.prisma.registrationToken.updateMany({
      where: {
        userId,
        status: TokenStatus.PENDING,
        expiresIn: { gt: new Date(Date.now()) },
      },
      data: {
        expiresIn: new Date(Date.now() - 1),
      },
    });
  }

  async confirmRegistration(details: ConfirmEmailDto): Promise<void> {
    const token = await this.validateRegistrationToken(details.token);
    await this.prisma.registrationToken.update({
      where: { id: token.id },
      data: { status: TokenStatus.FULFILLED },
    });
    const user = await this.usersService.confirmUser({
      id: token.userId,
    });
    await this.sendWelcomeEmail(user);
  }

  private async sendRegistrationConfirmationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      template: 'email-confirmation',
      context: {
        title: 'Подтверждение регистрации',
        confirmationUrl: `${
          this.config.get<DomainOptions>('domainOptions').frontend
        }/confirm-registration/${token}`,
      },
    });
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Добро пожаловать на сайт',
      template: 'welcome',
    });
  }

  private async validateRegistrationToken(
    tokenValue: string,
  ): Promise<RegistrationToken> {
    const tokenInfo = await this.prisma.registrationToken.findUnique({
      where: { token: tokenValue },
    });
    return HelpersMethods.checkToken(tokenInfo);
  }
}
