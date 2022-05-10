import { BadRequestException } from '@nestjs/common';

export class CourseFullException extends BadRequestException {
  constructor(courseId: number) {
    super(`Курс с идентификатором ${courseId} уже заполнен`);
  }
}
