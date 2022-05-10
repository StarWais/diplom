import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { BrowserInfo } from '../../../common/decorators/browser-info.decorator';
import { UsersService } from '../../users/services';
import { JWTPayload } from '../strategies/jwt.strategy';
import { SignupDto } from '../dto/request';
import { AccessTokenDto } from '../dto/response';
import { AuthConfirmService } from './auth-confirm.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authConfirmService: AuthConfirmService,
  ) {}
  static async hashPassword(
    password: string,
    saltRounds = 10,
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateJWTToken(user: User): AccessTokenDto {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
    };
    return new AccessTokenDto({
      accessToken: this.jwtService.sign(payload),
    });
  }

  async onUserSignedUp(user: User, browserInfo: BrowserInfo): Promise<void> {
    return this.authConfirmService.createSendRegistrationToken(
      user,
      browserInfo,
    );
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

  async signup(
    details: SignupDto,
    browserInfo: BrowserInfo,
  ): Promise<AccessTokenDto> {
    const { password, ...restUserDetails } = details;
    const hashedPassword = await AuthService.hashPassword(password);
    const user = await this.usersService.create({
      password: hashedPassword,
      ...restUserDetails,
    });
    await this.onUserSignedUp(user, browserInfo);
    return this.generateJWTToken(user);
  }

  async signin(user: User): Promise<AccessTokenDto> {
    return this.generateJWTToken(user);
  }
}
