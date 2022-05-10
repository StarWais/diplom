import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ApplicationStatus, Course, Prisma } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

import {
  CourseApplicationCreateDto,
  CourseApplicationUpdateDto,
} from '../dto/request';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { CourseApplicationInclude } from '../interfaces';
import { FindByCourseIdParams, FindCourseApplicationParams } from '../params';
import {
  CourseApplicationNotFoundException,
  CourseFinishedException,
  CourseFullException,
  StudentAlreadyAttachedException,
  StudentAlreadyAttendingCourseException,
} from '../exceptions';
import { CourseApplicationDto } from '../dto/response';
import { CoursesService } from './courses.service';
import { UsersService } from '../../users/services';

@Injectable()
export class CoursesApplicationsService {
  private readonly courseApplicationInclude: CourseApplicationInclude = {
    include: {
      student: true,
      course: true,
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  async findOneOrThrowError(
    searchParams: FindCourseApplicationParams,
  ): Promise<CourseApplicationDto> {
    const result = await this.prisma.courseApplication.findFirst({
      where: searchParams,
    });
    if (!result) {
      throw new CourseApplicationNotFoundException(searchParams.id);
    }
    return new CourseApplicationDto(result);
  }

  async delete(searchParams: FindCourseApplicationParams): Promise<void> {
    await this.findOneOrThrowError(searchParams);
    await this.prisma.courseApplication.delete({
      where: searchParams,
    });
  }

  async create(
    searchParams: FindByCourseIdParams,
    details: CourseApplicationCreateDto,
  ): Promise<CourseApplicationDto> {
    const { courseId } = searchParams;
    const course = await this.coursesService.findOneOrThrowError({
      id: courseId,
    });
    if (course.finished) {
      throw new CourseFinishedException(courseId);
    }
    if (course.placesAvailable === 0) {
      throw new CourseFullException(courseId);
    }
    const result = await this.prisma.courseApplication.create({
      data: {
        ...details,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });
    const application = new CourseApplicationDto(result);
    await this.notifyAdminsOnCourseApply(application, course);
    return application;
  }

  async findMany(
    searchParams: FindByCourseIdParams,
    paginationDetails: PaginationQuery,
  ): Promise<PaginatedDto<CourseApplicationDto>> {
    const { courseId } = searchParams;
    await this.coursesService.findOneOrThrowError({
      id: courseId,
    });
    return Paginate<Prisma.CourseApplicationFindManyArgs>(
      CourseApplicationDto,
      {
        limit: paginationDetails.limit,
        page: paginationDetails.page,
      },
      this.prisma,
      'courseApplication',
      {
        where: {
          course: {
            id: courseId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...this.courseApplicationInclude,
      },
      (application) => new CourseApplicationDto(application),
    );
  }

  async update(
    searchParams: FindCourseApplicationParams,
    details: CourseApplicationUpdateDto,
  ): Promise<CourseApplicationDto> {
    const { studentId, ...rest } = details;
    const application = await this.findOneOrThrowError(searchParams);
    const course = await this.coursesService.findOneWithCoursesOrThrowError({
      id: application.courseId,
    });
    const isFulfilling = rest.status === ApplicationStatus.FULFILLED;
    if (isFulfilling) {
      if (course.placesAvailable === 0) {
        throw new CourseFullException(course.id);
      }
    }
    if (studentId) {
      if (application.studentId) {
        throw new StudentAlreadyAttachedException(application.id);
      }
      if (course.students.some((student) => student.id === studentId)) {
        throw new StudentAlreadyAttendingCourseException(studentId, course.id);
      }
    }
    const result = await this.prisma.courseApplication.update({
      where: {
        id: application.id,
      },
      data: {
        ...rest,
        student: studentId
          ? {
              connect: {
                id: studentId,
              },
            }
          : undefined,
        course:
          studentId && isFulfilling
            ? {
                update: {
                  students: {
                    connect: {
                      id: studentId,
                    },
                  },
                  placesAvailable: {
                    decrement: 1,
                  },
                },
              }
            : undefined,
      },
    });
    return new CourseApplicationDto(result);
  }

  async notifyAdminsOnCourseApply(
    application: CourseApplicationDto,
    course: Course,
  ): Promise<void> {
    const adminMails = await this.usersService.getAdminConfirmedMails();
    await this.mailerService.sendMail({
      to: adminMails,
      subject: 'Новая зяявка на курс',
      template: 'new-course-application',
      context: {
        applicantName: application.applicantName,
        applicantPhone: application.applicantPhone,
        courseName: course.name,
        courseGrade: course.grade,
      },
    });
  }
}
