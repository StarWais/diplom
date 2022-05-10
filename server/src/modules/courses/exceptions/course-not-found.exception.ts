import { BadRequestException } from '@nestjs/common';

export class CourseNotFoundException extends BadRequestException {
  constructor(courseId: number) {
    super(`Курс с идентификатором ${courseId} не найден`);
  }
}
