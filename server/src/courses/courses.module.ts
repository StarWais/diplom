import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [TeachersModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
