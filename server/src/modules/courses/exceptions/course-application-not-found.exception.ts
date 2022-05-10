import { NotFoundException } from '@nestjs/common';

export class CourseApplicationNotFoundException extends NotFoundException {
  constructor(courseApplicationId: number) {
    super(`Заявка на курс с идентификатором ${courseApplicationId} не найдена`);
  }
}
