import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { UsersService } from './services';
import { IsEmailUserAlreadyExistConstraint } from './validators';
import { FormDataConfigService } from '@config/services';
import { UsersController } from './controllers';

@Module({
  imports: [
    NestjsFormDataModule.configAsync({
      useClass: FormDataConfigService,
    }),
  ],
  providers: [UsersService, IsEmailUserAlreadyExistConstraint],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
