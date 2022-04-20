import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';

@Injectable()
export class InfoService {
  constructor(private readonly prisma: PrismaService) {}

  async getCounts() {
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
    };
  }

  async getLastReviews() {
    const [lastCoursesReviews, lastOlympiadReviews] =
      await this.prisma.$transaction([
        this.prisma.courseReview.findMany({
          where: {
            published: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                middleName: true,
                avatarLink: true,
              },
            },
          },
          take: 5,
        }),
        this.prisma.olympiadReview.findMany({
          where: {
            published: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                middleName: true,
                avatarLink: true,
              },
            },
          },
          take: 5,
        }),
      ]);
    const lastReviews = [...lastCoursesReviews, ...lastOlympiadReviews];
    return lastReviews
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .slice(0, 9);
  }
}
