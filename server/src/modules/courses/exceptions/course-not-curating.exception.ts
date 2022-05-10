import { BadRequestException } from '@nestjs/common';

export class CourseNotCuratingException extends BadRequestException {
  constructor(courseId: number) {
    super(`Вы не преподаете курс с идентификатором ${courseId}`);
  }
}
