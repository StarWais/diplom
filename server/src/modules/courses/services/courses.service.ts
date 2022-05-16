import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { MailerService } from '@nestjs-modules/mailer';
import { isBefore } from 'date-fns';
import { Prisma, PublishingStatus, Role, User } from '@prisma/client';

import { CourseCreateDto, CourseUpdateDto } from '../dto/request';

import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { TeachersService } from '../../teachers/services';
import { StudentsService } from '../../students/services';
import { UsersService } from '../../users/services';
import { ImagesService } from '../../images/services';
import { HelpersMethods } from '../../../common/helpers/helpers.methods';
import {
  CourseDto,
  CourseListedDto,
  CourseListedPersonalStudentDto,
  CourseListedPersonalTeacherDto,
  CourseTagDto,
} from '../dto/response';
import { FindOneByIDParams } from '../../../common/params';
import { CourseInclude, CourseWithStudents } from '../interfaces';
import {
  CourseNotCuratingException,
  CourseNotFoundException,
} from '../exceptions';
import { GetCoursesFilter, GetPersonalCoursesFilter } from '../filters';
import { BasicUserNameDto } from '../../users/dto/response';

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

  private readonly courseBasicInclude: CourseInclude = {
    include: {
      teacher: {
        include: {
          user: true,
        },
      },
      tags: true,
      modules: true,
      steps: true,
      students: true,
    },
  };

  private readonly courseWithStudentsInclude: CourseInclude = {
    include: {
      students: {
        include: {
          user: true,
        },
      },
    },
  };

  async findOneOrThrowError(
    searchParams: FindOneByIDParams,
    convertToDto = true,
  ): Promise<CourseDto | CourseWithStudents> {
    const { id } = searchParams;
    const result = await this.prisma.course.findUnique({
      where: searchParams,
      ...this.courseBasicInclude,
    });
    if (!result) {
      throw new CourseNotFoundException(id);
    }
    return convertToDto
      ? new CourseDto(result)
      : (result as CourseWithStudents);
  }

  async findOneWithCoursesOrThrowError(
    details: Prisma.CourseWhereUniqueInput,
  ): Promise<CourseWithStudents> {
    const result = await this.prisma.course.findUnique({
      where: details,
      ...this.courseWithStudentsInclude,
    });
    if (!result) {
      throw new CourseNotFoundException(details.id);
    }
    return result as CourseWithStudents;
  }

  async findStudents(
    searchParams: FindOneByIDParams,
    currentUser: User,
  ): Promise<Array<BasicUserNameDto>> {
    const { id } = searchParams;
    const course = (await this.findOneOrThrowError(
      searchParams,
      false,
    )) as CourseWithStudents;
    if (
      currentUser.role === Role.TEACHER &&
      course.teacherId !== currentUser.id
    ) {
      throw new CourseNotCuratingException(id);
    }
    return course.students as unknown as Array<BasicUserNameDto>;
  }

  async updateFinishedCourses(): Promise<void> {
    const courses = await this.findAllWithStudents();
    const finishedCourses = courses.filter(
      (course) => isBefore(course.finishDate, new Date()) && !course.finished,
    );
    await this.prisma.course.updateMany({
      where: {
        id: {
          in: finishedCourses.map((course) => course.id),
        },
      },
      data: {
        finished: true,
      },
    });
    await Promise.all(
      finishedCourses.map(async (finishedCourse) => {
        await this.teachersService.addTaughtStudents(
          finishedCourse.teacherId,
          finishedCourse.students,
        );
      }),
    );
  }

  async create(details: CourseCreateDto): Promise<CourseDto> {
    await this.teachersService.findOneOrThrowError({
      id: details.teacherId,
    });
    const { teacherId, modules, steps, tags, image, placesAvailable, ...rest } =
      details;
    const imageLink = await this.imageService.save(image);
    const result = await this.prisma.course.create({
      data: {
        placesAvailable,
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
      ...this.courseBasicInclude,
    });

    return new CourseDto(result);
  }

  async findMany(
    filter: GetCoursesFilter,
  ): Promise<PaginatedDto<CourseListedDto>> {
    return Paginate<Prisma.CourseFindManyArgs>(
      CourseListedDto,
      {
        page: filter.page,
        limit: filter.limit,
      },
      this.prisma,
      'course',
      {
        where: {
          tags: {
            some: {
              name: {
                in: filter.tags,
              },
            },
          },
          grade: {
            equals: filter.grade,
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      },
      (course) => new CourseListedDto(course),
    );
  }

  async findAttending(
    filter: GetPersonalCoursesFilter,
    currentUser: User,
  ): Promise<PaginatedDto<CourseListedPersonalStudentDto>> {
    return Paginate<Prisma.CourseFindManyArgs>(
      CourseListedPersonalStudentDto,
      {
        page: filter.page,
        limit: filter.limit,
      },
      this.prisma,
      'course',
      {
        where: {
          students: {
            some: {
              id: currentUser.id,
            },
          },
          tags: {
            some: {
              name: {
                in: filter.tags,
              },
            },
          },
          finished: filter.finished,
          grade: {
            equals: filter.grade,
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      },
      (course) => new CourseListedPersonalStudentDto(course),
    );
  }

  async findTeaching(
    filter: GetPersonalCoursesFilter,
    currentUser: User,
  ): Promise<PaginatedDto<CourseListedPersonalTeacherDto>> {
    return Paginate<Prisma.CourseFindManyArgs>(
      CourseListedPersonalTeacherDto,
      {
        page: filter.page,
        limit: filter.limit,
      },
      this.prisma,
      'course',
      {
        where: {
          teacherId: currentUser.id,
          tags: {
            some: {
              name: {
                in: filter.tags,
              },
            },
          },
          finished: filter.finished,
          grade: {
            equals: filter.grade,
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      },
      (course) => new CourseListedPersonalTeacherDto(course),
    );
  }

  async findTopRated(): Promise<Array<CourseListedDto>> {
    const results = await this.prisma.course.findMany({
      where: {},
      orderBy: {
        rating: 'desc',
      },
      take: 6,
    });
    return results.map((course) => new CourseListedDto(course));
  }

  async tags(): Promise<Array<CourseTagDto>> {
    const tags = await this.prisma.courseTag.findMany();
    return tags.map((tag) => new CourseTagDto(tag));
  }

  async delete(searchParams: FindOneByIDParams): Promise<void> {
    await this.findOneWithCoursesOrThrowError(searchParams);
    await this.prisma.course.delete({
      where: searchParams,
    });
  }

  async update(
    searchParams: FindOneByIDParams,
    details: CourseUpdateDto,
  ): Promise<CourseDto> {
    const { id } = searchParams;
    await this.findOneWithCoursesOrThrowError({
      id,
    });
    const { teacherId, steps, modules, image, tags, ...rest } = details;
    const imageLink = image ? await this.imageService.save(image) : undefined;
    const result = await this.prisma.course.update({
      where: {
        id,
      },
      data: {
        ...rest,
        imageLink,
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
        steps: steps
          ? {
              deleteMany: {
                courseId: id,
              },
              create: steps,
            }
          : undefined,
        modules: modules
          ? {
              deleteMany: {
                courseId: id,
              },
              create: modules,
            }
          : undefined,
      },
      ...this.courseBasicInclude,
    });

    return new CourseDto(result);
  }

  async dateInCourseRange(courseId: number, date: Date): Promise<boolean> {
    const course = await this.findOneWithCoursesOrThrowError({ id: courseId });
    return HelpersMethods.checkIfDateIsInRange(
      course.startDate,
      course.finishDate,
      date,
    );
  }

  async updateRating(courseId: number): Promise<void> {
    const reviews = await this.prisma.courseReview.findMany({
      where: {
        courseId,
        status: PublishingStatus.PUBLISHED,
      },
    });
    if (reviews.length === 0) {
      return;
    }
    const rating = reviews.reduce((acc, review) => acc + review.rating, 0);
    await this.prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        rating: rating / reviews.length,
      },
    });
  }

  private async findAllWithStudents(): Promise<Array<CourseWithStudents>> {
    const result = await this.prisma.course.findMany({
      where: {},
      ...this.courseWithStudentsInclude,
    });
    return result as Array<CourseWithStudents>;
  }
}
