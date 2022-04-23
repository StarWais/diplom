import { Injectable } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CoursesJobs {
  constructor(private readonly coursesService: CoursesService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCourseFinished() {
    await this.coursesService.updateFinishedCourses();
  }
}
