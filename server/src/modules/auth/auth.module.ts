import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthConfirmService, AuthResetService, AuthService } from './services';
import {
  AuthConfirmController,
  AuthController,
  AuthResetController,
} from './controllers';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtConfigService } from '../../config/services';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    AuthService,
    AuthConfirmService,
    AuthResetService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController, AuthResetController, AuthConfirmController],
})
export class AuthModule {}
