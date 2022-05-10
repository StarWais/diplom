import { NotFoundException } from '@nestjs/common';

export class CourseReviewNotFoundException extends NotFoundException {
  constructor(courseReviewId: number) {
    super(`Отзыв к курсу с идентификатором ${courseReviewId} не найден`);
  }
}
