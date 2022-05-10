import { BadRequestException } from '@nestjs/common';

export class StudentAlreadyAttendingCourseException extends BadRequestException {
  constructor(studentId: number, courseId: number) {
    super(
      `Студент с идентификатором ${studentId} уже записан на курс с идентификатором ${courseId}`,
    );
  }
}
