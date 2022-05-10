import { NotFoundException } from '@nestjs/common';

export class CourseAttendanceNotFoundException extends NotFoundException {
  constructor(courseAttendanceId: number) {
    super(
      `Запись посещения курса с идентификатором ${courseAttendanceId} не найдена`,
    );
  }
}
