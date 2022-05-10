import { BadRequestException } from '@nestjs/common';

export class StudentAlreadyAttachedException extends BadRequestException {
  constructor(courseApplicationId: number) {
    super(
      `Студент по заявке с идентификатором ${courseApplicationId} уже назначен`,
    );
  }
}
