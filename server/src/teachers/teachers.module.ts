import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
  imports: [UsersModule],
})
export class TeachersModule {}
