import { BadRequestException } from '@nestjs/common';

export class CourseAttendanceExistsOnDayException extends BadRequestException {
  constructor(studentId: number) {
    super(
      `Посещение на этот день для студента с индентификатором ${studentId} уже существует`,
    );
  }
}
