import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(details: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: details,
    });
  }

  async findUniqueOrThrowError(details: Prisma.UserWhereUniqueInput) {
    const user = await this.findUnique(details);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async updatePassword(
    searchDetails: Prisma.UserWhereUniqueInput,
    newPassword: string,
  ) {
    return this.prisma.user.update({
      where: searchDetails,
      data: {
        password: newPassword,
      },
    });
  }

  async confirmUser(details: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.update({
      where: details,
      data: {
        confirmed: true,
      },
    });
  }

  async getAdminMails() {
    const admins = await this.findAdmins();
    return admins.map((admin) => admin.email);
  }

  async create(details: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...details,
        studentInfo: {
          create: {},
        },
      },
    });
  }

  async findAdmins() {
    return this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
    });
  }

  async userExists(details: Prisma.UserWhereUniqueInput) {
    return !!(await this.findUnique(details));
  }
}
