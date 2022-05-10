import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Course, Prisma, PublishingStatus, User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { CourseReviewCreateDto, CourseReviewUpdateDto } from '../dto/request';
import { CoursesService } from './courses.service';
import { FindByCourseIdParams, FindCourseReviewParams } from '../params';
import { CourseReviewDto } from '../dto/response';
import { CourseReviewInclude } from '../interfaces';
import {
  CourseAlreadyReviewedException,
  CourseNotFinishedException,
  CourseReviewNotFoundException,
} from '../exceptions';
import { UsersService } from '../../users/services';

@Injectable()
export class CoursesReviewsService {
  private readonly courseReviewInclude: CourseReviewInclude = {
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
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async findOneOrThrowError(
    searchParams: FindCourseReviewParams,
  ): Promise<CourseReviewDto> {
    const { id, courseId } = searchParams;
    const result = await this.prisma.courseReview.findFirst({
      where: {
        id,
        courseId,
      },
    });
    if (!result) {
      throw new CourseReviewNotFoundException(id);
    }
    return new CourseReviewDto(result);
  }

  async update(
    searchParams: FindCourseReviewParams,
    details: CourseReviewUpdateDto,
  ): Promise<CourseReviewDto> {
    const { id, courseId } = searchParams;
    await this.findOneOrThrowError(searchParams);
    const result = await this.prisma.courseReview.update({
      where: {
        id,
      },
      data: details,
    });
    await this.coursesService.updateCourseRating(courseId);
    return new CourseReviewDto(result);
  }

  async findMany(
    searchParams: FindByCourseIdParams,
    paginationDetails: PaginationQuery,
    ignoreDrafts = false,
  ): Promise<PaginatedDto<CourseReviewDto>> {
    const { courseId } = searchParams;
    await this.coursesService.findOneOrThrowError({
      id: courseId,
    });
    return Paginate<Prisma.CourseReviewFindManyArgs>(
      CourseReviewDto,
      {
        limit: paginationDetails.limit,
        page: paginationDetails.page,
      },
      this.prisma,
      'courseReview',
      {
        where: {
          course: {
            id: courseId,
          },
          status: ignoreDrafts ? undefined : PublishingStatus.PUBLISHED,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...this.courseReviewInclude,
      },
      (courseReview) => new CourseReviewDto(courseReview),
    );
  }

  async checkIfUserReviewedCourse(
    userId: number,
    courseId: number,
  ): Promise<boolean> {
    const review = await this.prisma.courseReview.findFirst({
      where: {
        studentId: userId,
        courseId,
      },
    });
    return !!review;
  }

  async delete(searchParams: FindCourseReviewParams): Promise<void> {
    const { id } = searchParams;
    await this.findOneOrThrowError(searchParams);
    const review = await this.prisma.courseReview.delete({
      where: {
        id,
      },
    });
    await this.coursesService.updateCourseRating(review.courseId);
  }

  async create(
    searchParams: FindByCourseIdParams,
    details: CourseReviewCreateDto,
    currentUser: User,
  ): Promise<CourseReviewDto> {
    const { courseId } = searchParams;
    const course = await this.coursesService.findOneOrThrowError({
      id: courseId,
    });
    if (!course.finished) {
      throw new CourseNotFinishedException(courseId);
    }
    const userReviewedCourse = await this.checkIfUserReviewedCourse(
      currentUser.id,
      courseId,
    );
    if (userReviewedCourse) {
      throw new CourseAlreadyReviewedException(courseId);
    }
    const result = await this.prisma.courseReview.create({
      data: {
        ...details,
        course: {
          connect: {
            id: courseId,
          },
        },
        student: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      ...this.courseReviewInclude,
    });
    const review = new CourseReviewDto(result);

    await this.notifyAdminsOnReviewCreate(review, course);

    return review;
  }

  private async notifyAdminsOnReviewCreate(
    review: CourseReviewDto,
    course: Course,
  ): Promise<void> {
    const adminMails = await this.usersService.getAdminConfirmedMails();
    await this.mailerService.sendMail({
      to: adminMails,
      subject: 'Новый отзыв к курсу',
      template: 'new-course-review',
      context: {
        reviewText: review.text,
        authorFullName: review.author.fullName,
        courseName: course.name,
        courseGrade: course.grade,
      },
    });
  }
}
