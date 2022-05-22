import { Module } from '@nestjs/common';

import { UsersModule } from '@users/users.module';
import { TeachersController } from './controllers';
import { TeachersService } from './services';
import { StudentsModule } from '@students/students.module';

@Module({
  imports: [UsersModule, StudentsModule],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
