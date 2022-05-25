import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

import { PaginationQuery } from '@pagination/pagination-query';
import { FindOneByIDParams } from '@common/params';
import { FaqDto } from '@faq/dto/response';
import { Paginate, PaginatedDto } from '@pagination/pagination';
import { FaqNotFoundException } from '@faq/exceptions';
import { CreateFaqDto, UpdateFaqDto } from '@faq/dto/request';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneOrThrowError(searchParams: FindOneByIDParams): Promise<FaqDto> {
    const result = await this.prisma.fAQQuestion.findUnique({
      where: searchParams,
    });
    if (!result) {
      throw new FaqNotFoundException(searchParams.id);
    }
    return new FaqDto(result);
  }

  async findAll(query: PaginationQuery): Promise<PaginatedDto<FaqDto>> {
    return Paginate<Prisma.FAQQuestionFindManyArgs>(
      FaqDto,
      query,
      this.prisma,
      'fAQQuestion',
      {
        orderBy: {
          createdAt: 'desc',
        },
      },
      (faq) => new FaqDto(faq),
    );
  }

  async findPublished(query: PaginationQuery): Promise<PaginatedDto<FaqDto>> {
    return Paginate<Prisma.FAQQuestionFindManyArgs>(
      FaqDto,
      query,
      this.prisma,
      'fAQQuestion',
      {
        where: {
          answer: {
            not: null,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      (faq) => new FaqDto(faq),
    );
  }

  async update(
    searchParams: FindOneByIDParams,
    details: UpdateFaqDto,
  ): Promise<FaqDto> {
    await this.findOneOrThrowError(searchParams);
    const result = await this.prisma.fAQQuestion.update({
      where: searchParams,
      data: details,
    });
    return new FaqDto(result);
  }

  async create(details: CreateFaqDto): Promise<FaqDto> {
    const result = await this.prisma.fAQQuestion.create({
      data: details,
    });
    return new FaqDto(result);
  }

  async delete(searchParams: FindOneByIDParams): Promise<void> {
    await this.findOneOrThrowError(searchParams);
    await this.prisma.fAQQuestion.delete({
      where: searchParams,
    });
  }
}
