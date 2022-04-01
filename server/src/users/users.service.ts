import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(details: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: details,
    });
  }

  async updatePassword(
    searchDetails: Prisma.UserWhereUniqueInput,
    newPassword: string,
  ): Promise<User> {
    return this.prisma.user.update({
      where: searchDetails,
      data: {
        password: newPassword,
      },
    });
  }

  async confirmUser(searchDetails: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.update({
      where: searchDetails,
      data: {
        confirmed: true,
      },
    });
  }

  async create(details: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: details });
  }

  async userExists(details: Prisma.UserWhereUniqueInput): Promise<boolean> {
    return !!(await this.findUnique(details));
  }
}
