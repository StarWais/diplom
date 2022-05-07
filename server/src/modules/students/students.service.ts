import { Course, Prisma, Role, User } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findStudentOrThrowError(details: Prisma.StudentWhereUniqueInput) {
    const student = await this.prisma.student.findUnique({
      where: details,
    });
    if (!student) {
      throw new NotFoundException('Студент не найден');
    }
    return student;
  }

  private async findStudentWithCoursesOrThrowError(
    details: Prisma.StudentWhereUniqueInput,
  ) {
    const student = await this.prisma.student.findUnique({
      where: details,
      include: {
        courses: true,
      },
    });
    if (!student) {
      throw new NotFoundException('Студент не найден');
    }
    return student;
  }

  async checkIfStudentFinishedCourseAndThrowError(user: User, course: Course) {
    if (user.role === Role.ADMIN) return;
    const student = await this.findStudentWithCoursesOrThrowError({
      userId: user.id,
    });

    if (!student.courses.some((c) => c.id === course.id)) {
      throw new BadRequestException('Вы не записаны на этот курс');
    }

    if (!course.finished) {
      throw new BadRequestException('Курс еще не завершен');
    }
  }

  async checkIfStudentIsAttendingCourse(studentId: number, courseId: number) {
    const student = await this.findStudentWithCoursesOrThrowError({
      id: studentId,
    });
    return !!student.courses.some((c) => c.id === courseId);
  }
}
