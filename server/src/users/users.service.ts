import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role, User } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(details: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: details,
    });
  }

  async findUniqueOrThrowError(
    details: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.findUnique(details);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
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

  async confirmUser(details: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.update({
      where: details,
      data: {
        confirmed: true,
      },
    });
  }

  async getAdminMails(): Promise<string[]> {
    const admins = await this.findAdmins();
    return admins.map((admin) => admin.email);
  }

  async create(details: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...details,
        studentInfo: {
          create: {},
        },
      },
    });
  }

  async findAdmins(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
    });
  }

  async userExists(details: Prisma.UserWhereUniqueInput): Promise<boolean> {
    return !!(await this.findUnique(details));
  }
}
