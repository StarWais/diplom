import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { StudentsModule } from '../students/students.module';
import { FormdataConfigService } from '../../config/services';
import {
  CoursesApplicationsController,
  CoursesAttendancesController,
  CoursesController,
  CoursesReviewsController,
} from './controllers';
import {
  CoursesApplicationsService,
  CoursesAttendancesService,
  CoursesReviewsService,
  CoursesService,
} from './services';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';
import { CoursesJobs } from './jobs';

@Module({
  imports: [
    TeachersModule,
    StudentsModule,
    UsersModule,
    NestjsFormDataModule.configAsync({
      useClass: FormdataConfigService,
    }),
  ],
  controllers: [
    CoursesController,
    CoursesReviewsController,
    CoursesAttendancesController,
    CoursesApplicationsController,
  ],
  providers: [
    CoursesService,
    CoursesJobs,
    CoursesApplicationsService,
    CoursesReviewsService,
    CoursesAttendancesService,
  ],
})
export class CoursesModule {}
