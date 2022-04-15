import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { AuthOptions } from '../configuration';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    const authConfig = this.configService.get<AuthOptions>('authOptions');

    return {
      secret: authConfig.jwt.secret,
      signOptions: {
        expiresIn: authConfig.jwt.expiresIn,
      },
    };
  }
}
