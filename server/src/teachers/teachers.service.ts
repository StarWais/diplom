import { UsersService } from '../users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Course, Prisma, Role, Teacher, User } from '@prisma/client';
import {
  CreateTeacherDto,
  RateTeacherDto,
  UpdateTeacherDto,
} from './dto/request';
import { TeachersGetFilter } from './filters';
import { Paginate } from '../common/pagination/pagination';
import { StudentsService } from '../students/students.service';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
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

  private async updateTeacherRating(teacherId: number) {
    const reviews = await this.prisma.teacherRating.findMany({
      where: {
        teacherId,
      },
    });
    if (reviews.length === 0) {
      return;
    }
    const rating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return this.prisma.teacher.update({
      where: {
        id: teacherId,
      },
      data: {
        rating: rating / reviews.length,
      },
    });
  }

  async findTeacherWithUserInfoOrThrowError(
    details: Prisma.TeacherWhereUniqueInput,
  ) {
    const teacher = await this.prisma.teacher.findUnique({
      where: details,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            phone: true,
            firstName: true,
            lastName: true,
            middleName: true,
            birthDate: true,
            gender: true,
          },
        },
      },
    });
    if (!teacher) {
      throw new NotFoundException('Учитель не найден');
    }
    return teacher;
  }

  async findAll(details: TeachersGetFilter) {
    return Paginate<Teacher, Prisma.TeacherFindManyArgs>(
      {
        limit: details.limit,
        page: details.page,
      },
      this.prisma,
      'teacher',
      {
        where: {
          OR: [
            {
              specialisations: {
                hasSome: details.categories,
              },
            },
            {
              OR: [
                {
                  user: {
                    OR: [
                      {
                        firstName: {
                          contains: details.search || '',
                        },
                      },
                      {
                        lastName: {
                          contains: details.search || '',
                        },
                      },
                      {
                        middleName: {
                          contains: details.search || '',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              middleName: true,
              avatarLink: true,
            },
          },
        },
      },
    );
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

  async rate(
    searchDetails: Prisma.TeacherWhereUniqueInput,
    details: RateTeacherDto,
    currentUser: User,
  ) {
    const teacher = await this.findTeacherOrThrowError(searchDetails);
    const student = await this.studentsService.findStudentOrThrowError({
      userId: currentUser.id,
    });
    const teacherRatings = await this.prisma.teacherRating.findMany({
      where: {
        teacherId: teacher.id,
      },
    });
    const studentIds = teacherRatings.map(
      (teacherRating) => teacherRating.studentId,
    );
    if (studentIds.includes(student.id)) {
      throw new BadRequestException('Вы уже оценили этого учителя');
    }
    const rating = await this.prisma.teacherRating.create({
      data: {
        teacher: {
          connect: {
            id: teacher.id,
          },
        },
        student: {
          connect: {
            id: student.id,
          },
        },
        rating: details.rating,
      },
    });
    await this.updateTeacherRating(teacher.id);
    return rating;
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
    return this.usersService.makeTeacher(dbUser);
  }
}
