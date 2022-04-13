import { StudentsModule } from '../students/students.module';
import { FormdataConfigService } from '../config/services';
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TeachersModule } from '../teachers/teachers.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TeachersModule,
    StudentsModule,
    UsersModule,
    NestjsFormDataModule.configAsync({
      useClass: FormdataConfigService,
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
