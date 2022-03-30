import { AuthOptions, DomainOptions } from './../config/configuration';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, RegistrationToken, TokenStatus, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UsersService } from './../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { AuthToken } from './models/auth-token.entity';
import { JWTPayload } from './strategies/jwt.strategy';
import { MailerService } from '@nestjs-modules/mailer';

export interface EmailTokenPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}
  private async hashPassword(
    password: string,
    saltRounds = 10,
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findUnique({ email });
      const isPasswordValid = await this.comparePassword(
        password,
        user.password,
      );
      if (isPasswordValid) {
        return user;
      }
      return null;
    } catch (error: any) {
      return null;
    }
  }

  async signup(details: SignupDto, ip: string, browser: string): Promise<User> {
    const { password, ...restUserDetails } = details;
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.create({
      password: hashedPassword,
      ...restUserDetails,
    });
    const confirmationToken = await this.createRegistrationToken({
      user: { connect: { id: user.id } },
      ip,
      browser,
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Подтверждение регистрации',
      template: 'email-confirmation',
      context: {
        title: 'Подтверждение регистрации',
        confirmationUrl: `${
          this.config.get<DomainOptions>('domainOptions').frontend
        }/confirm-registration/${confirmationToken.token}`,
      },
    });

    return user;
  }

  async signin(user: User): Promise<AuthToken> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
    };
    return new AuthToken(this.jwtService.sign(payload));
  }

  async validateRegistrationToken(
    tokenValue: string,
  ): Promise<RegistrationToken> {
    const tokenInfo = await this.prisma.registrationToken.findUnique({
      where: { token: tokenValue },
      rejectOnNotFound: true,
    });

    if (tokenInfo.expiresIn.getTime() < Date.now()) {
      throw new BadRequestException('Токен просрочен');
    }
    if (tokenInfo.status === TokenStatus.FULFILLED) {
      throw new BadRequestException('Токен уже использован');
    }
    return tokenInfo;
  }

  async createRegistrationToken(
    details: Omit<Prisma.RegistrationTokenCreateInput, 'token' | 'expiresIn'>,
  ): Promise<RegistrationToken> {
    const tokenValue = crypto.randomBytes(32).toString('hex');
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

  async confirmRegistration(tokenId: number, userId: number) {
    await this.prisma.$transaction([
      this.prisma.registrationToken.update({
        where: { id: tokenId },
        data: { status: TokenStatus.FULFILLED },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { confirmed: true },
      }),
    ]);
  }
}
