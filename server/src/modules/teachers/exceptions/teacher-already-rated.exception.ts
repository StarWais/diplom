import { BadRequestException } from '@nestjs/common';

export class TeacherAlreadyRatedException extends BadRequestException {
  constructor(teacherId: number) {
    super(`Вы уже оценили учителя с идентификатором ${teacherId}`);
  }
}
