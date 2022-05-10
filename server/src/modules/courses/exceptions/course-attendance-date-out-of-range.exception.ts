import { BadRequestException } from '@nestjs/common';

export class CourseAttendanceDateOutOfRangeException extends BadRequestException {
  constructor() {
    super('Выбранная дата посещаемости не попадает в диапазон дат курса');
  }
}
