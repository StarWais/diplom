import { BadRequestException } from '@nestjs/common';

export class StudentNotTaughtException extends BadRequestException {
  constructor(teacherId: number) {
    super(`Учитель с идентификатором ${teacherId} еще не преподавал Вам.`);
  }
}
