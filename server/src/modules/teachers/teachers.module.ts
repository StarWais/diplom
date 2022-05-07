import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [UsersModule, StudentsModule],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
