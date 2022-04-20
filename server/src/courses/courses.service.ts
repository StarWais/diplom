import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  ApplicationStatus,
  Course,
  CourseApplication,
  CourseReview,
  Prisma,
  User,
} from '@prisma/client';

import {
  CourseApplicationCreateDto,
  CourseApplicationUpdateDto,
  CourseCreateDto,
  CourseUpdateDto,
  CreateCourseReviewDto,
} from './dto';
import { Paginate } from '../common/pagination/pagination';
import { TeachersService } from '../teachers/teachers.service';
import { StudentsService } from '../students/students.service';
import { PaginationQuery } from '../common/pagination/pagination-query';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { GetCoursesFilter } from '../common/filters/get-courses.filter';
import { isBefore } from 'date-fns';
import { ImagesService } from '../common/images/images.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teachersService: TeachersService,
    private readonly studentsService: StudentsService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly imageService: ImagesService,
  ) {}

  private async findApplicationOrThrowError(
    details: Prisma.CourseApplicationWhereUniqueInput,
  ) {
    const application = await this.prisma.courseApplication.findUnique({
      where: details,
    });
    if (!application) {
      throw new NotFoundException('Заявка не найдена');
    }
    return application;
  }

  async create(details: CourseCreateDto) {
    await this.teachersService.findTeacherOrThrowError({
      id: details.teacherId,
    });
    const { teacherId, modules, steps, tags, image, ...rest } = details;
    const imageLink = await this.imageService.saveImage(image);
    return this.prisma.course.create({
      data: {
        ...rest,
        imageLink,
        teacher: {
          connect: {
            id: teacherId,
          },
        },
        modules: {
          create: modules,
        },
        steps: {
          create: steps,
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              name: tag.name,
            },
            create: tag,
          })),
        },
      },
      include: {
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                middleName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tags: true,
        modules: true,
        steps: true,
      },
    });
  }

  async findCourseOrThrowError(details: Prisma.CourseWhereUniqueInput) {
    const course = await this.prisma.course.findUnique({
      where: details,
      include: {
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                middleName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tags: true,
        modules: true,
        steps: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundException('Курс не найден');
    }
    return course;
  }

  private async findCourseWithStudents(details: Prisma.CourseWhereUniqueInput) {
    return this.prisma.course.findUnique({
      where: details,
      include: {
        students: true,
      },
    });
  }

  async findMyStudentsCourses(currentUser: User) {
    const courses = await this.prisma.course.findMany({
      where: {
        students: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });
    return courses.map(async (course) => ({
      ...course,
      finished: isBefore(course.finishDate, new Date()),
      rated: await this.checkIfUserAlreadyReviewedCourse(currentUser, course),
    }));
  }

  async findAll(details: GetCoursesFilter) {
    return Paginate<Course, Prisma.CourseFindManyArgs>(
      {
        page: details.page,
        limit: details.limit,
      },
      this.prisma,
      'course',
      {
        where: {
          tags: {
            some: {
              name: {
                in: details.tags,
              },
            },
          },
          grade: {
            equals: details.grade,
          },
        },
        orderBy: {
          startDate: 'desc',
        },
        include: {
          teacher: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  middleName: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          tags: true,
          modules: true,
          steps: true,
        },
      },
    );
  }

  async findTopRated() {
    return this.prisma.course.findMany({
      where: {},
      orderBy: {
        rating: 'desc',
      },
      take: 6,
    });
  }

  async tags() {
    return this.prisma.courseTag.findMany();
  }

  async delete(details: Prisma.CourseWhereUniqueInput) {
    await this.findCourseOrThrowError(details);
    return this.prisma.course.delete({
      where: details,
    });
  }

  async findReviewOrThrowError(details: Prisma.CourseReviewWhereUniqueInput) {
    const review = await this.prisma.courseReview.findUnique({
      where: details,
      include: {
        course: {
          select: {
            id: true,
            teacher: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    middleName: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }
    return review;
  }

  async deleteReview(details: Prisma.CourseReviewWhereUniqueInput) {
    await this.findReviewOrThrowError(details);
    const review = await this.prisma.courseReview.delete({
      where: details,
    });
    await this.updateCourseRating(review.courseId);
    return review;
  }

  async update(
    searchDetails: Prisma.CourseWhereUniqueInput,
    details: CourseUpdateDto,
  ) {
    await this.findCourseOrThrowError(searchDetails);
    details.teacherId &&
      (await this.teachersService.findTeacherOrThrowError({
        id: details.teacherId,
      }));
    const { teacherId, tags, ...rest } = details;
    return this.prisma.course.update({
      where: searchDetails,
      data: {
        ...rest,
        teacher: teacherId
          ? {
              connect: {
                id: teacherId,
              },
            }
          : undefined,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              name: tag.name,
            },
            create: tag,
          })),
        },
        steps: details.steps
          ? {
              deleteMany: {
                courseId: searchDetails.id,
              },
              create: details.steps,
            }
          : undefined,
        modules: details.modules
          ? {
              deleteMany: {
                courseId: searchDetails.id,
              },
              create: details.modules,
            }
          : undefined,
      },
      include: {
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                middleName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tags: true,
        modules: true,
        steps: true,
      },
    });
  }

  async publishReview(reviewId: number) {
    await this.findReviewOrThrowError({
      id: reviewId,
    });
    const review = await this.prisma.courseReview.update({
      where: {
        id: reviewId,
      },
      data: {
        published: true,
      },
    });
    await this.updateCourseRating(review.courseId);
    return review;
  }

  async findReviews(
    courseDetails: Prisma.CourseWhereUniqueInput,
    paginationDetails: PaginationQuery,
  ) {
    const course = await this.findCourseOrThrowError(courseDetails);
    return Paginate<CourseReview, Prisma.CourseReviewFindManyArgs>(
      {
        limit: paginationDetails.limit,
        page: paginationDetails.page,
      },
      this.prisma,
      'courseReview',
      {
        where: {
          course: {
            id: course.id,
          },
          published: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              middleName: true,
              firstName: true,
              lastName: true,
              avatarLink: true,
            },
          },
        },
      },
    );
  }

  private async checkIfUserAlreadyReviewedCourseAndThrowError(
    user: User,
    course: Course,
  ) {
    const review = await this.prisma.courseReview.findFirst({
      where: {
        authorId: user.id,
        courseId: course.id,
      },
    });
    if (review) {
      throw new BadRequestException('Вы уже оставляли отзыв на этот курс');
    }
  }

  private async checkIfUserAlreadyReviewedCourse(user: User, course: Course) {
    return !!(await this.prisma.courseReview.findFirst({
      where: {
        authorId: user.id,
        courseId: course.id,
      },
    }));
  }

  private async updateCourseRating(courseId: number) {
    const reviews = await this.prisma.courseReview.findMany({
      where: {
        courseId,
        published: true,
      },
    });
    if (reviews.length === 0) {
      return;
    }
    const rating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return this.prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        rating: rating / reviews.length,
      },
    });
  }

  async createReview(
    courseDetails: Prisma.CourseWhereUniqueInput,
    details: CreateCourseReviewDto,
    currentUser: User,
  ) {
    const course = await this.findCourseOrThrowError(courseDetails);
    await this.studentsService.checkIfStudentFinishedCourse(
      currentUser,
      course,
    );
    await this.checkIfUserAlreadyReviewedCourseAndThrowError(
      currentUser,
      course,
    );
    const review = await this.prisma.courseReview.create({
      data: {
        ...details,
        course: {
          connect: {
            id: course.id,
          },
        },
        author: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            middleName: true,
            firstName: true,
            lastName: true,
            avatarLink: true,
          },
        },
      },
    });

    await this.notifyAdminsOnReviewCreate(review, course);
    return review;
  }

  async notifyAdminsOnReviewCreate(
    review: CourseReview & { author: Partial<User> },
    course: Course,
  ) {
    const adminMails = await this.usersService.getAdminMails();
    await this.mailerService.sendMail({
      to: adminMails,
      subject: 'Новый отзыв к курсу',
      template: 'new-course-review',
      context: {
        reviewText: review.text,
        authorFullName: `${review.author.lastName} ${review.author.firstName} ${review.author.middleName} `,
        courseName: course.name,
        courseGrade: course.grade,
      },
    });
  }

  async notifyAdminsOnCourseApply(
    application: CourseApplication,
    course: Course,
  ) {
    const adminMails = await this.usersService.getAdminMails();
    await this.mailerService.sendMail({
      to: adminMails,
      subject: 'Новая зяявка на курc',
      template: 'new-course-application',
      context: {
        appliciantName: application.appliciantName,
        appliciantPhone: application.appliciantPhone,
        courseName: course.name,
        courseGrade: course.grade,
      },
    });
  }

  async applyToCourse(courseId: number, details: CourseApplicationCreateDto) {
    const course = await this.findCourseOrThrowError({
      id: courseId,
    });
    await this.checkIfCourseHasFreePlaces(course.id);
    const application = await this.prisma.courseApplication.create({
      data: {
        ...details,
        course: {
          connect: {
            id: course.id,
          },
        },
      },
    });
    await this.notifyAdminsOnCourseApply(application, course);
    return application;
  }

  async findApplications(
    courseDetails: Prisma.CourseWhereUniqueInput,
    paginationDetails: PaginationQuery,
  ) {
    const course = await this.findCourseOrThrowError(courseDetails);
    return Paginate<CourseApplication, Prisma.CourseApplicationFindManyArgs>(
      {
        limit: paginationDetails.limit,
        page: paginationDetails.page,
      },
      this.prisma,
      'courseApplication',
      {
        where: {
          course: {
            id: course.id,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  id: true,
                  lastName: true,
                  middleName: true,
                },
              },
            },
          },
        },
      },
    );
  }

  private async checkIfCourseHasFreePlaces(courseId: number) {
    const course = await this.findCourseWithStudents({ id: courseId });
    if (course.capacity < course.students.length) {
      throw new BadRequestException('Нет свободных мест');
    }
  }

  async updateApplication(
    applicationId: number,
    details: CourseApplicationUpdateDto,
  ) {
    const application = await this.findApplicationOrThrowError({
      id: applicationId,
    });
    const { studentId, ...rest } = details;
    const isFulfilling = rest.status === ApplicationStatus.FULFILLED;
    if (studentId) {
      if (application.studentId) {
        throw new BadRequestException('Студент уже назначен');
      }
      await this.studentsService.checkIfStudentIsAttendingCourse(
        studentId,
        application.courseId,
      );
    }
    if (isFulfilling) {
      await this.checkIfCourseHasFreePlaces(application.courseId);
    }
    return this.prisma.courseApplication.update({
      where: {
        id: applicationId,
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
                },
              }
            : undefined,
      },
    });
  }
}
