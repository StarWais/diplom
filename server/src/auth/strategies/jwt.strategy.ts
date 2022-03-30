import { User } from '@prisma/client';
import { UsersService } from './../../users/users.service';
import { AuthOptions } from './../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

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
    try {
      const user = await this.usersService.findUnique({
        id: payload.sub,
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
