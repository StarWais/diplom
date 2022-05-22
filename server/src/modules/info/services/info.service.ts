import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, PublishingStatus, Role } from '@prisma/client';

import { InfoCountsDto, InfoReviewDto } from '../dto/response';

@Injectable()
export class InfoService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly reviewsFindManyArgs:
    | Prisma.CourseReviewFindManyArgs
    | Prisma.OlympiadReviewFindManyArgs = {
    where: {
      status: PublishingStatus.PUBLISHED,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      student: true,
    },
    take: 5,
  };

  async counts(): Promise<InfoCountsDto> {
    const [teachersCount, studentsCount, coursesCount, olympiadsCount] =
      await this.prisma.$transaction([
        this.prisma.user.count({
          where: {
            role: Role.TEACHER,
          },
        }),
        this.prisma.user.count({
          where: {
            role: Role.STUDENT,
          },
        }),
        this.prisma.course.count(),
        this.prisma.olympiad.count(),
      ]);
    return {
      teachersCount,
      studentsCount,
      coursesCount,
      olympiadsCount,
    } as InfoCountsDto;
  }

  async lastReviews(): Promise<Array<InfoReviewDto>> {
    const [lastCoursesReviews, lastOlympiadReviews] =
      await this.prisma.$transaction([
        this.prisma.courseReview.findMany(
          this.reviewsFindManyArgs as Prisma.CourseReviewFindManyArgs,
        ),
        this.prisma.olympiadReview.findMany(
          this.reviewsFindManyArgs as Prisma.OlympiadReviewFindManyArgs,
        ),
      ]);
    const lastReviews = [...lastCoursesReviews, ...lastOlympiadReviews];
    return lastReviews
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 9) as unknown as Array<InfoReviewDto>;
  }
}
