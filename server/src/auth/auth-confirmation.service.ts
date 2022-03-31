import { BrowserInfo } from './../decorators/browser-info.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RegistrationToken, TokenStatus, Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as crypto from 'crypto';
import { AuthOptions, DomainOptions } from './../config/configuration';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthConfirmationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}
  private async validateRegistrationToken(
    tokenValue: string,
  ): Promise<RegistrationToken> {
    const tokenInfo = await this.prisma.registrationToken.findUnique({
      where: { token: tokenValue },
    });
    if (!tokenInfo) {
      throw new NotFoundException('Токен не найден');
    }
    if (tokenInfo.expiresIn.getTime() < Date.now()) {
      throw new BadRequestException('Токен просрочен');
    }
    if (tokenInfo.status === TokenStatus.FULFILLED) {
      throw new BadRequestException('Токен уже использован');
    }
    return tokenInfo;
  }

  private async sendConfirmationEmail(
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

  async confirmRegistration(tokenId: string): Promise<void> {
    const token = await this.validateRegistrationToken(tokenId);
    await this.prisma.registrationToken.update({
      where: { id: token.id },
      data: { status: TokenStatus.FULFILLED },
    });
    await this.userService.confirmUser({
      id: token.userId,
    });
  }

  async onUserSignedUp(user: User, browserInfo: BrowserInfo): Promise<void> {
    const token = await this.createRegistrationToken({
      user: {
        connect: {
          id: user.id,
        },
      },
      ...browserInfo,
    });
    await this.sendConfirmationEmail(user.email, token.token);
  }

  private async createRegistrationToken(
    details: Omit<Prisma.RegistrationTokenCreateInput, 'token' | 'expiresIn'>,
  ): Promise<RegistrationToken> {
    const tokenValue = crypto.randomBytes(12).toString('hex');
    const token = await this.prisma.registrationToken.create({
      data: {
        token: tokenValue,
        expiresIn: new Date(
          this.config.get<AuthOptions>('authOptions')
            .emailConfirmationTokenExpiresIn + Date.now(),
        ),
        ...details,
      },
    });
    return token;
  }
}
