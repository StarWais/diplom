import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(details: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({
      where: details,
      rejectOnNotFound: true,
    });
  }

  async create(details: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: details });
  }

  async userExists(details: Prisma.UserWhereUniqueInput): Promise<boolean> {
    try {
      await this.findUnique(details);
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
