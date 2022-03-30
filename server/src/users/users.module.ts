import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { IsEmailUserAlreadyExistConstraint } from './validators/users.validator';

@Module({
  providers: [UsersService, IsEmailUserAlreadyExistConstraint],
  exports: [UsersService],
})
export class UsersModule {}
