import { Prisma, Student } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { StudentNotFoundException } from '../exceptions';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneOrThrowError(
    searchDetails: Prisma.StudentWhereUniqueInput,
  ): Promise<Student> {
    const { id } = searchDetails;
    const result = await this.prisma.student.findUnique({
      where: searchDetails,
    });
    if (!result) {
      throw new StudentNotFoundException(id);
    }
    return result;
  }
}
