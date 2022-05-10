import { BadRequestException } from '@nestjs/common';

export class CourseFinishedException extends BadRequestException {
  constructor(courseId: number) {
    super(`Курс с идентификатором ${courseId} уже завершен`);
  }
}
