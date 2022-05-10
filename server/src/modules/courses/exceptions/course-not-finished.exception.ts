import { BadRequestException } from '@nestjs/common';

export class CourseNotFinishedException extends BadRequestException {
  constructor(courseId: number) {
    super(`Курс с идентификатором ${courseId} еще не завершен`);
  }
}
