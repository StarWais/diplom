import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { UsersService } from '@users/services';
import { AuthOptions } from '@config/configuration';

export interface JWTPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: config.get<AuthOptions>('authOptions').ignoreExpiration,
      secretOrKey: config.get<AuthOptions>('authOptions').jwt.secret,
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    return this.usersService.findUnique({
      id: payload.sub,
    });
  }
}
