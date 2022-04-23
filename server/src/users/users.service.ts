import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role, User } from '@prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImagesService } from '../common/images/images.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImagesService,
  ) {}

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

  async makeTeacher(user: User) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { role: user.role !== Role.ADMIN ? Role.TEACHER : undefined },
    });
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

  async removeAvatar(details: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.update({
      where: details,
      data: {
        avatarLink: null,
      },
    });
  }

  private async validateEmailChange(user: User, updateUserDto: UpdateUserDto) {
    const userWithEmail = await this.findUnique({ email: updateUserDto.email });
    if (userWithEmail && userWithEmail.id !== user.id) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
  }

  private async checkUpdatePermission(
    currentUser: User,
    searchDetails: Prisma.UserWhereUniqueInput,
  ) {
    if (currentUser.role === Role.ADMIN) {
      return;
    }
    if (currentUser.id !== searchDetails.id) {
      throw new ForbiddenException();
    }
  }

  async updateUserInfo(
    searchDetails: Prisma.UserWhereUniqueInput,
    details: UpdateUserDto,
    currentUser: User,
  ) {
    await this.checkUpdatePermission(currentUser, searchDetails);
    const updatedUser = await this.findUniqueOrThrowError(searchDetails);
    await this.validateEmailChange(updatedUser, details);
    const { avatar, ...rest } = details;
    let newAvatarLink = undefined;
    if (avatar) {
      newAvatarLink = await this.imageService.saveImage(avatar);
    }
    return this.prisma.user.update({
      where: searchDetails,
      data: {
        ...rest,
        avatarLink: newAvatarLink,
      },
    });
  }
}
