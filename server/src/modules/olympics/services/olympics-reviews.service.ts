import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Olympiad, Prisma, PublishingStatus, User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

import { OlympicReviewDto } from '../dto/response';
import {
  OlympicAlreadyReviewedException,
  OlympicNotAttendedException,
  OlympicReviewNotFoundException,
} from '../exceptions';
import { OlympicsService } from './olympics.service';
import { FindByOlympicsIdParams, FindOlympicReviewParams } from '../params';
import { OlympicReviewInclude } from '../interfaces';
import { OlympicReviewCreateDto } from '../dto/request/olympic-review-create.dto';
import { OlympicReviewUpdateDto } from '../dto/request/olympic-review-update.dto';
import { PaginationQuery } from '../../../common/pagination/pagination-query';
import { Paginate, PaginatedDto } from '../../../common/pagination/pagination';
import { UsersService } from '../../users/services';

@Injectable()
export class OlympicsReviewsService {
  private readonly olympicReviewInclude: OlympicReviewInclude = {
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
    private readonly olympicsService: OlympicsService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    searchParams: FindByOlympicsIdParams,
    details: OlympicReviewCreateDto,
    currentUser: User,
  ): Promise<OlympicReviewDto> {
    const { olympicsId } = searchParams;
    const olympiad = await this.olympicsService.findOneOrThrowError({
      id: olympicsId,
    });
    const attended = await this.olympicsService.userAttended(
      olympicsId,
      currentUser.id,
    );
    if (!attended) {
      throw new OlympicNotAttendedException(olympicsId);
    }
    const reviewed = await this.userReviewed(olympicsId, currentUser.id);
    if (reviewed) {
      throw new OlympicAlreadyReviewedException(olympicsId);
    }

    const result = await this.prisma.olympiadReview.create({
      data: {
        ...details,
        olympiad: {
          connect: {
            id: olympicsId,
          },
        },
        student: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      ...this.olympicReviewInclude,
    });

    const review = new OlympicReviewDto(result);
    await this.notifyAdminsOnReviewCreate(review, olympiad);
    return review;
  }

  async findOneOrThrowError(
    searchParams: FindOlympicReviewParams,
  ): Promise<OlympicReviewDto> {
    const { olympicsId, id } = searchParams;
    const result = await this.prisma.olympiadReview.findFirst({
      where: {
        id,
        olympiadId: olympicsId,
      },
      ...this.olympicReviewInclude,
    });
    if (!result) {
      throw new OlympicReviewNotFoundException(id);
    }
    return new OlympicReviewDto(result);
  }

  async findMany(
    searchParams: FindByOlympicsIdParams,
    filter: PaginationQuery,
    ignoreDrafts = false,
  ): Promise<PaginatedDto<OlympicReviewDto>> {
    const { olympicsId } = searchParams;
    return Paginate<Prisma.OlympiadReviewFindManyArgs>(
      OlympicReviewDto,
      filter,
      this.prisma,
      'olympiadReview',
      {
        where: {
          olympiadId: olympicsId,
          status: ignoreDrafts ? undefined : PublishingStatus.PUBLISHED,
        },
        orderBy: {
          createdAt: 'desc',
        },
        ...this.olympicReviewInclude,
      },
      (review) => new OlympicReviewDto(review),
    );
  }

  async update(
    searchParams: FindOlympicReviewParams,
    details: OlympicReviewUpdateDto,
  ): Promise<OlympicReviewDto> {
    await this.findOneOrThrowError(searchParams);
    const result = await this.prisma.olympiadReview.update({
      where: {
        id: searchParams.id,
      },
      data: details,
    });
    await this.olympicsService.updateRating(searchParams.olympicsId);
    return new OlympicReviewDto(result);
  }

  async delete(searchParams: FindOlympicReviewParams): Promise<void> {
    await this.findOneOrThrowError(searchParams);
    await this.prisma.olympiadReview.delete({
      where: {
        id: searchParams.id,
      },
    });
  }

  private async userReviewed(
    olympicsId: number,
    studentId: number,
  ): Promise<boolean> {
    const review = await this.prisma.olympiadReview.findFirst({
      where: {
        olympiadId: olympicsId,
        studentId,
      },
    });
    return !!review;
  }

  private async notifyAdminsOnReviewCreate(
    review: OlympicReviewDto,
    olympiad: Olympiad,
  ): Promise<void> {
    const adminMails = await this.usersService.getAdminConfirmedMails();
    await this.mailerService.sendMail({
      to: adminMails,
      subject: 'Новый отзыв к олимпиаде',
      template: 'new-olympic-review',
      context: {
        reviewText: review.text,
        authorFullName: `${review.student.user.lastName} ${review.student.user.firstName} ${review.student.user.lastName} `,
        olympicName: olympiad.name,
        olympicGrade: olympiad.grade,
      },
    });
  }
}
