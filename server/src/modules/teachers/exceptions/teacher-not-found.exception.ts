import { BadRequestException } from '@nestjs/common';

export class TeacherNotFoundException extends BadRequestException {
  constructor(teacherId: number) {
    super(`Преподаватель с идентификатором ${teacherId} не найден`);
  }
}
