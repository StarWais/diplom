import { Prisma, Role, User, Course, Student } from '@prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateStudentDto } from './dto/request';

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

  async findStudentWithCoursesOrThrowError(
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

  private async checkUpdatePermissions(user: User, student: Student) {
    if (user.role === Role.ADMIN) return;
    if (user.id !== student.userId) {
      throw new ForbiddenException();
    }
  }

  async update(
    searchDetails: Prisma.StudentWhereUniqueInput,
    details: UpdateStudentDto,
    currentUser: User,
  ) {
    const student = await this.findStudentOrThrowError(searchDetails);
    await this.checkUpdatePermissions(currentUser, student);
    return this.prisma.student.update({
      where: searchDetails,
      data: {
        ...details,
      },
    });
  }
}
