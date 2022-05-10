import { NotFoundException } from '@nestjs/common';

export class StudentNotFoundException extends NotFoundException {
  constructor(studentId: number) {
    super(`Студент с идентификатором ${studentId} не найден`);
  }
}
