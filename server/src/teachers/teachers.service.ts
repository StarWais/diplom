import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async findTeacherOrThrowError(details: Prisma.TeacherWhereUniqueInput) {
    const teacher = await this.prisma.teacher.findUnique({
      where: details,
    });
    if (!teacher) {
      throw new NotFoundException('Учитель не найден');
    }
    return teacher;
  }
}
