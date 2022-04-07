import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Course, CourseReview, Prisma, User } from '@prisma/client';
import { CourseCreateDto } from './dto';
import { CoursesGetFilter } from './filters';
import { Paginate } from '../common/pagination/pagination';
import { CourseUpdateDto } from './dto/course-update.dto';
import { TeachersService } from '../teachers/teachers.service';
import { PaginationQuery } from '../common/pagination/pagination-query';
import { CreateCourseReviewDto } from './dto/create-course-review.dto';

@Injectable()
export class CoursesService {
  constructor(
    readonly prisma: PrismaService,
    readonly teachersService: TeachersService,
  ) {}

  async create(details: CourseCreateDto) {
    await this.teachersService.findTeacherOrThrowError({
      id: details.teacherId,
    });
    const { teacherId, modules, steps, tags, ...rest } = details;
    return this.prisma.course.create({
      data: {
        ...rest,
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
      },
    });
    if (!course) {
      throw new NotFoundException('Курс не найден');
    }
    return course;
  }

  async findAll(details: CoursesGetFilter) {
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
    return this.prisma.courseReview.delete({
      where: details,
    });
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
              avatar: {
                include: {
                  file: {
                    select: {
                      path: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    );
  }

  async createReview(
    courseDetails: Prisma.CourseWhereUniqueInput,
    details: CreateCourseReviewDto,
    currentUser: User,
  ) {
    const course = await this.findCourseOrThrowError(courseDetails);
    return this.prisma.courseReview.create({
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
            avatar: {
              include: {
                file: {
                  select: {
                    path: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
