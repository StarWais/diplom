import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthConfirmationService } from './auth-confirmation.service';
import { BrowserInfo } from './../decorators/browser-info.decorator';
import { UsersService } from './../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { AuthToken } from './models/auth-token.entity';
import { JWTPayload } from './strategies/jwt.strategy';

export interface EmailTokenPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authConfirmationService: AuthConfirmationService,
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

  private async generateJWTToken(user: User): Promise<AuthToken> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
    };
    return new AuthToken(this.jwtService.sign(payload));
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUnique({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async signup(
    details: SignupDto,
    browserInfo: BrowserInfo,
  ): Promise<AuthToken> {
    const { password, ...restUserDetails } = details;
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.create({
      password: hashedPassword,
      ...restUserDetails,
    });
    await this.authConfirmationService.onUserSignedUp(user, browserInfo);
    return this.generateJWTToken(user);
  }

  async signin(user: User): Promise<AuthToken> {
    return this.generateJWTToken(user);
  }
}
