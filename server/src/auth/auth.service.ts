import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PrismaService } from 'nestjs-prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  User,
  Prisma,
  RegistrationToken,
  TokenStatus,
  PasswordResetToken,
} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import {
  DomainOptions,
  ConfirmationTokenOptions,
} from '../config/configuration';
import { BrowserInfo } from '../decorators/browser-info.decorator';
import { UsersService } from '../users/users.service';
import { JWTPayload } from './strategies/jwt.strategy';
import {
  ConfirmEmailDto,
  ConfirmPasswordResetDto,
  PasswordResetDto,
  SignupDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  private static async hashPassword(password: string, saltRounds = 10) {
    return bcrypt.hash(password, saltRounds);
  }

  private static async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private async generateJWTToken(user: User) {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async resetPassword(details: PasswordResetDto, browserInfo: BrowserInfo) {
    const user = await this.usersService.findUnique({ email: details.email });
    if (!user) {
      throw new BadRequestException(
        'Пользователя с указанным email адресом не существует',
      );
    }
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

  private checkToken<T extends PasswordResetToken | RegistrationToken>(
    token: T,
  ): T {
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

  async confirmPasswordReset(details: ConfirmPasswordResetDto) {
    const { token: tokenValue, newPassword } = details;
    const token = await this.validatePasswordResetToken(tokenValue);
    const user = await this.usersService.findUnique({
      id: token.userId,
    });

    const compareNewPassword = await AuthService.comparePassword(
      newPassword,
      user.password,
    );
    if (compareNewPassword) {
      throw new BadRequestException(
        'Новый пароль не должен совпадать с старым',
      );
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

  private async validatePasswordResetToken(
    tokenValue: string,
  ): Promise<PasswordResetToken> {
    const tokenInfo = await this.prisma.passwordResetToken.findUnique({
      where: { token: tokenValue },
    });
    return this.checkToken(tokenInfo);
  }

  private async validateRegistrationToken(
    tokenValue: string,
  ): Promise<RegistrationToken> {
    const tokenInfo = await this.prisma.registrationToken.findUnique({
      where: { token: tokenValue },
    });
    return this.checkToken(tokenInfo);
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

  async confirmRegistration(details: ConfirmEmailDto): Promise<void> {
    const token = await this.validateRegistrationToken(details.token);
    await this.prisma.registrationToken.update({
      where: { id: token.id },
      data: { status: TokenStatus.FULFILLED },
    });
    await this.usersService.confirmUser({
      id: token.userId,
    });
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

  private async createSendRegistrationToken(
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
  async sendAnotherRegistrationToken(
    user: User,
    browserInfo: BrowserInfo,
  ): Promise<void> {
    if (user.confirmed) {
      throw new BadRequestException('Пользователь уже подтвержден');
    }
    await this.disableOtherRegistrationTokens(user.id);
    return this.createSendRegistrationToken(user, browserInfo);
  }

  async onUserSignedUp(user: User, browserInfo: BrowserInfo): Promise<void> {
    return this.createSendRegistrationToken(user, browserInfo);
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

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUnique({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await AuthService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async signup(details: SignupDto, browserInfo: BrowserInfo) {
    const { password, ...restUserDetails } = details;
    const hashedPassword = await AuthService.hashPassword(password);
    const user = await this.usersService.create({
      password: hashedPassword,
      ...restUserDetails,
    });
    await this.onUserSignedUp(user, browserInfo);
    return this.generateJWTToken(user);
  }

  async signin(user: User) {
    return this.generateJWTToken(user);
  }
}
