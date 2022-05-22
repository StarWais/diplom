import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role, User } from '@prisma/client';
import {
  CourseAttendanceCreateDto,
  CourseAttendanceUpdateDto,
} from '../dto/request';
import { CoursesService } from './courses.service';
import { FindByCourseIdParams, FindCourseAttendanceParams } from '../params';
import {
  CourseAttendanceDateOutOfRangeException,
  CourseAttendanceExistsOnDayException,
  CourseAttendanceNotFoundException,
  CourseNotCuratingException,
} from '../exceptions';
import { HelpersMethods } from '@common/helpers/helpers.methods';
import { CourseAttendanceInclude } from '../interfaces';
import { CourseAttendanceDto } from '../dto/response';
import { Paginate, PaginatedDto } from '@pagination/pagination';
import { GetCoursesAttendancesFilter } from '../filters';

@Injectable()
export class CoursesAttendancesService {
  private readonly courseAttendanceInclude: CourseAttendanceInclude = {
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  async findOneOrThrowError(
    searchParams: FindCourseAttendanceParams,
  ): Promise<CourseAttendanceDto> {
    const { id } = searchParams;
    const result = await this.prisma.courseAttendance.findFirst({
      where: searchParams,
      ...this.courseAttendanceInclude,
    });
    if (!result) {
      throw new CourseAttendanceNotFoundException(id);
    }
    return new CourseAttendanceDto(result);
  }

  async create(
    searchParams: FindByCourseIdParams,
    details: CourseAttendanceCreateDto,
    currentUser: User,
  ): Promise<CourseAttendanceDto> {
    const { courseId } = searchParams;
    const { studentId, ...rest } = details;
    const course = await this.coursesService.findOneOrThrowError({
      id: courseId,
    });
    const inRange = await this.coursesService.dateInCourseRange(
      courseId,
      details.date,
    );
    if (!inRange) {
      throw new CourseAttendanceDateOutOfRangeException();
    }
    if (course.teacherId !== currentUser.id) {
      throw new CourseNotCuratingException(courseId);
    }
    const attendanceExists = await this.studentAttendanceExistsOnDay(
      studentId,
      courseId,
      details.date,
    );
    if (attendanceExists) {
      throw new CourseAttendanceExistsOnDayException(studentId);
    }
    const result = await this.prisma.courseAttendance.create({
      data: {
        ...rest,
        course: {
          connect: {
            id: course.id,
          },
        },
        student: {
          connect: {
            id: studentId,
          },
        },
      },
    });

    return new CourseAttendanceDto(result);
  }

  async delete(
    searchParams: FindCourseAttendanceParams,
    currentUser: User,
  ): Promise<void> {
    const { courseId } = searchParams;
    const course = await this.coursesService.findOneOrThrowError({
      id: courseId,
    });
    if (course.teacherId !== currentUser.id) {
      throw new CourseNotCuratingException(courseId);
    }
    await this.findOneOrThrowError(searchParams);
    await this.prisma.courseAttendance.delete({
      where: searchParams,
    });
  }

  async findMany(
    searchParams: FindByCourseIdParams,
    filter: GetCoursesAttendancesFilter,
    currentUser: User,
    self = false,
  ): Promise<PaginatedDto<CourseAttendanceDto>> {
    const { courseId } = searchParams;
    const course = await this.coursesService.findOneOrThrowError({
      id: searchParams.courseId,
    });

    if (
      currentUser.role === Role.TEACHER &&
      course.teacherId !== currentUser.id
    ) {
      throw new CourseNotCuratingException(courseId);
    }

    return Paginate<Prisma.CourseAttendanceFindManyArgs>(
      CourseAttendanceDto,
      filter,
      this.prisma,
      'courseAttendance',
      {
        where: {
          courseId,
          studentId: self ? currentUser.id : undefined,
        },
        orderBy: {
          date: 'asc',
        },
        ...this.courseAttendanceInclude,
      },
      (attendance) => new CourseAttendanceDto(attendance),
    );
  }

  async update(
    searchParams: FindCourseAttendanceParams,
    details: CourseAttendanceUpdateDto,
    currentUser: User,
  ): Promise<CourseAttendanceDto> {
    const { courseId } = searchParams;
    await this.findOneOrThrowError(searchParams);
    const course = await this.coursesService.findOneOrThrowError({
      id: courseId,
    });
    if (course.teacherId !== currentUser.id) {
      throw new CourseNotCuratingException(courseId);
    }
    const result = await this.prisma.courseAttendance.update({
      where: searchParams,
      data: {
        ...details,
      },
    });
    return new CourseAttendanceDto(result);
  }

  private async studentAttendanceExistsOnDay(
    studentId: number,
    courseId: number,
    date: Date,
  ): Promise<boolean> {
    const attendances = await this.prisma.courseAttendance.findMany({
      where: {
        studentId,
        courseId,
      },
    });
    return attendances.some((attendance) =>
      HelpersMethods.compareDatesWithoutTime(attendance.date, date),
    );
  }
}
