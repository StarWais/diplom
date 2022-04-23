import { UsersService } from '../users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Course, Prisma, Role, Teacher, User } from '@prisma/client';
import { CreateTeacherDto, UpdateTeacherDto } from './dto';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async findTeacherOrThrowError(details: Prisma.TeacherWhereUniqueInput) {
    const teacher = await this.prisma.teacher.findUnique({
      where: details,
    });
    if (!teacher) {
      throw new NotFoundException('Учитель не найден');
    }
    return teacher;
  }

  async checkIfTeacherIsCuratingCourseOrThrowError(
    userDetails: Prisma.TeacherWhereUniqueInput,
    course: Course,
  ) {
    const user = await this.usersService.findUnique({
      id: userDetails.userId,
    });
    if (user.role === Role.ADMIN) {
      return;
    }
    const teacher = await this.findTeacherOrThrowError(userDetails);
    if (course.teacherId !== teacher.id) {
      throw new BadRequestException('Учитель не ведет этот курс');
    }
  }

  async updateTeacherStudentsCount(teacherId: number, studentsCount: number) {
    return this.prisma.teacher.update({
      where: {
        id: teacherId,
      },
      data: {
        studentsTaughtCount: {
          increment: studentsCount,
        },
      },
    });
  }

  private async checkUpdatePermissions(user: User, teacher: Teacher) {
    if (user.role === Role.ADMIN) {
      return;
    }
    if (user.id !== teacher.userId) {
      throw new ForbiddenException();
    }
  }

  async update(
    searchDetails: Prisma.TeacherWhereUniqueInput,
    details: UpdateTeacherDto,
    currentUser: User,
  ) {
    const teacher = await this.findTeacherOrThrowError(searchDetails);
    await this.checkUpdatePermissions(currentUser, teacher);
    return this.prisma.teacher.update({
      where: {
        id: teacher.id,
      },
      data: {
        ...details,
      },
    });
  }

  async create(details: CreateTeacherDto) {
    const dbUser = await this.usersService.findUniqueOrThrowError({
      id: details.userId,
    });
    if (dbUser.role === Role.TEACHER) {
      throw new BadRequestException('Пользователь уже является учителем');
    }
    await this.usersService.makeTeacher(dbUser);
    return this.prisma.teacher.create({
      data: {
        user: {
          connect: {
            id: dbUser.id,
          },
        },
      },
    });
  }
}
