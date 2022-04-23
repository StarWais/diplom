import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { IsEmailUserAlreadyExistConstraint } from './validators/users.validator';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FormdataConfigService } from '../config/services';

@Module({
  imports: [
    NestjsFormDataModule.configAsync({
      useClass: FormdataConfigService,
    }),
  ],
  providers: [UsersService, IsEmailUserAlreadyExistConstraint],
  exports: [UsersService],
})
export class UsersModule {}
