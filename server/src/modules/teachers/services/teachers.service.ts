import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role, Student, User } from '@prisma/client';

import { CreateTeacherDto, RateTeacherDto } from '../dto/request';
import { TeachersGetFilter } from '../filters';
import { Paginate, PaginatedDto } from '@pagination/pagination';
import { UsersService } from '@users/services';
import { FindOneByIDParams } from '@common/params';
import {
  StudentNotTaughtException,
  TeacherAlreadyRatedException,
  TeacherNotFoundException,
  UserAlreadyTeacherException,
} from '../exceptions';
import { TeacherInclude } from '../interfaces';
import { TeacherUserDto, TeacherUserListedDto } from '../dto/response';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private readonly teacherInclude: TeacherInclude = {
    include: {
      studentsTaught: true,
      user: true,
    },
  };

  private readonly teacherListInclude: TeacherInclude = {
    include: {
      user: true,
    },
  };

  async findOneOrThrowError(
    searchParams: FindOneByIDParams,
  ): Promise<TeacherUserDto> {
    const { id } = searchParams;
    const result = await this.prisma.teacher.findUnique({
      where: searchParams,
      ...this.teacherInclude,
    });
    if (!result) {
      throw new TeacherNotFoundException(id);
    }
    return new TeacherUserDto(result);
  }

  async findMany(
    filter: TeachersGetFilter,
  ): Promise<PaginatedDto<TeacherUserListedDto>> {
    return Paginate<Prisma.TeacherFindManyArgs>(
      TeacherUserListedDto,
      {
        limit: filter.limit,
        page: filter.page,
      },
      this.prisma,
      'teacher',
      {
        where: {
          // specialisations: {
          //   hasSome: filter?.categories,
          // },
          user: {
            OR: [
              {
                firstName: {
                  contains: filter.search || '',
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: filter.search || '',
                  mode: 'insensitive',
                },
              },
              {
                middleName: {
                  contains: filter.search || '',
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
        orderBy: {
          rating: 'desc',
        },
        ...this.teacherListInclude,
      },
      (teacher) => new TeacherUserListedDto(teacher.user),
    );
  }

  async addTaughtStudents(teacherId: number, students: Array<Student>) {
    return this.prisma.teacher.update({
      where: {
        id: teacherId,
      },
      data: {
        studentsTaught: {
          connect: students.map((student) => ({
            id: student.id,
          })),
        },
      },
    });
  }

  async rate(
    searchParams: FindOneByIDParams,
    details: RateTeacherDto,
    currentUser: User,
  ): Promise<void> {
    const teacher = await this.findOneOrThrowError(searchParams);
    const taught = await this.studentAlreadyTaught(teacher.id, currentUser.id);
    if (!taught) {
      throw new StudentNotTaughtException(teacher.id);
    }
    const rated = await this.studentAlreadyRated(currentUser.id, teacher.id);
    if (rated) {
      throw new TeacherAlreadyRatedException(teacher.id);
    }
    await this.prisma.teacherRating.create({
      data: {
        teacher: {
          connect: {
            id: teacher.id,
          },
        },
        student: {
          connect: {
            id: currentUser.id,
          },
        },
        rating: details.rating,
      },
    });
    await this.updateRating(teacher.id);
  }

  async create(details: CreateTeacherDto): Promise<void> {
    const dbUser = await this.usersService.findUniqueOrThrowError({
      id: details.userId,
    });
    if (dbUser.role === Role.TEACHER) {
      throw new UserAlreadyTeacherException(dbUser.id);
    }
    await this.usersService.makeTeacher(dbUser);
  }

  private async updateRating(teacherId: number): Promise<void> {
    const reviews = await this.prisma.teacherRating.findMany({
      where: {
        teacherId,
      },
    });
    if (reviews.length === 0) {
      return;
    }
    const rating = reviews.reduce((acc, review) => acc + review.rating, 0);
    await this.prisma.teacher.update({
      where: {
        id: teacherId,
      },
      data: {
        rating: rating / reviews.length,
      },
    });
  }

  private async studentAlreadyRated(
    studentId: number,
    teacherId: number,
  ): Promise<boolean> {
    const teacherRatings = await this.prisma.teacherRating.findMany({
      where: {
        teacherId,
      },
    });
    return !!teacherRatings.some((rating) => rating.studentId === studentId);
  }

  private async studentAlreadyTaught(
    teacherId: number,
    studentId: number,
  ): Promise<boolean> {
    const teacher = await this.findOneOrThrowError({ id: teacherId });
    return teacher.studentsTaught.some((student) => student.id === studentId);
  }
}
