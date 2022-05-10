import { BadRequestException } from '@nestjs/common';

export class CourseAlreadyReviewedException extends BadRequestException {
  constructor(courseId: number) {
    super(`Вы уже оценили курс с идентификатором ${courseId}`);
  }
}
