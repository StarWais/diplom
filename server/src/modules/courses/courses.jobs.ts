import { Injectable } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CoursesJobs {
  constructor(private readonly coursesService: CoursesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCourseIsFinished() {
    await this.coursesService.updateFinishedCourses();
  }
}
