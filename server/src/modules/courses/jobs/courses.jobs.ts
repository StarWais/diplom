import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CoursesService } from '../services';

@Injectable()
export class CoursesJobs {
  constructor(private readonly coursesService: CoursesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCourseIsFinished() {
    await this.coursesService.updateFinishedCourses();
  }
}
