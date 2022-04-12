import { StudentsModule } from './../students/students.module';
import { FormdataConfigService } from './../config/services/formdata-config.service';
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TeachersModule } from '../teachers/teachers.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TeachersModule,
    StudentsModule,
    NestjsFormDataModule.configAsync({
      useClass: FormdataConfigService,
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
