import { PrismaService } from 'nestjs-prisma';
import {
  EmailChangeToken,
  Prisma,
  Role,
  TokenStatus,
  User,
} from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import {
  ConfirmEmailChangeDto,
  UpdateUserAvatarDto,
  UpdateUserDto,
} from '../dto/request';
import { ImagesService } from '@images/services';
import { ConfirmationTokenOptions, DomainOptions } from '@config/configuration';
import { BrowserInfo } from '@common/decorators/browser-info.decorator';
import { HelpersMethods } from '@common/helpers/helpers.methods';
import { UsersGetFilter } from '../filters/users-get.filter';
import { Paginate } from '@pagination/pagination';
import { UserInclude } from '../interfaces';
import { UserDto, UserListedDto } from '../dto/response';
import {
  EmailAlreadyConfirmedException,
  EmailUserExistsException,
  SameEmailInputException,
  UserNotFoundException,
} from '../exceptions';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImagesService,
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  private userIncludeDetails: UserInclude = {
    include: {
      teacherInfo: true,
      studentInfo: true,
    },
  };

  async findUnique(details: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({
      where: details,
    });
  }

  async findMany(filter: UsersGetFilter) {
    return Paginate<Prisma.UserFindManyArgs>(
      UserListedDto,
      {
        limit: filter.limit,
        page: filter.page,
      },
      this.prisma,
      'user',
      {
        where: {
          role: {
            equals: filter.role,
          },
          OR: [
            {
              firstName: {
                contains: filter.search || '',
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: filter.search || '',
                mode: 'insensitive',
              },
            },
            {
              middleName: {
                contains: filter.search || '',
                mode: 'insensitive',
              },
            },
          ],
        },
        ...this.userIncludeDetails,
        orderBy: {
          createdAt: 'desc',
        },
      },
      (user) => new UserListedDto(user),
    );
  }

  async findUniqueOrThrowError(details: Prisma.UserWhereUniqueInput) {
    const result = await this.prisma.user.findUnique({
      where: details,
      ...this.userIncludeDetails,
    });
    if (!result) {
      throw new UserNotFoundException(details.id || details.email);
    }
    return new UserDto(result);
  }

  async makeTeacher(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        role: Role.TEACHER,
        studentInfo: {
          delete: true,
        },
        teacherInfo: {
          create: {},
        },
      },
      ...this.userIncludeDetails,
    });
  }

  async updatePassword(
    searchDetails: Prisma.UserWhereUniqueInput,
    newPassword: string,
  ): Promise<void> {
    await this.prisma.user.update({
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
      ...this.userIncludeDetails,
    });
  }

  async getAdminConfirmedMails() {
    const admins = await this.findAdmins();
    return admins
      .filter((admin) => admin.confirmed)
      .map((admin) => admin.email);
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

  async findAdmins(): Promise<Array<User>> {
    return this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
    });
  }

  async userExists(details: Prisma.UserWhereUniqueInput): Promise<boolean> {
    return !!(await this.findUnique(details));
  }

  async removeAvatar(details: Prisma.UserWhereUniqueInput): Promise<void> {
    await this.prisma.user.update({
      where: details,
      data: {
        avatarLink: null,
      },
    });
  }

  async sendAnotherEmailChangeToken(
    user: User,
    browserInfo: BrowserInfo,
  ): Promise<void> {
    if (user.newEmailConfirmed) {
      throw new EmailAlreadyConfirmedException();
    }
    await this.disableOtherEmailChangeTokens(user.id);
    return this.createSendEmailChangeToken(user, browserInfo);
  }

  async confirmEmailChange(details: ConfirmEmailChangeDto): Promise<void> {
    const token = await this.validateEmailChangeToken(details.token);
    await this.prisma.emailChangeToken.update({
      where: { id: token.id },
      data: { status: TokenStatus.FULFILLED },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: token.userId },
    });
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: user.newEmail || undefined,
        newEmail: null,
        newEmailConfirmed: true,
      },
      ...this.userIncludeDetails,
    });
  }

  async updateAvatar(
    searchDetails: Prisma.UserWhereUniqueInput,
    currentUser: User,
    details: UpdateUserAvatarDto,
  ): Promise<string> {
    await this.checkUpdatePermission(currentUser, searchDetails);
    await this.findUniqueOrThrowError(searchDetails);
    const avatarLink = await this.imageService.save(details.avatar);
    await this.prisma.user.update({
      where: searchDetails,
      data: {
        avatarLink,
      },
      ...this.userIncludeDetails,
    });
    return avatarLink;
  }

  async update(
    searchDetails: Prisma.UserWhereUniqueInput,
    details: UpdateUserDto,
    currentUser: User,
    browserInfo: BrowserInfo,
  ): Promise<UserDto> {
    await this.checkUpdatePermission(currentUser, searchDetails);
    const userToUpdate = await this.findUniqueOrThrowError(searchDetails);
    const { email, studentInfo, teacherInfo, ...rest } = details;

    if (details.email) {
      await this.validateEmailChange(userToUpdate, details);
      await this.createSendEmailChangeToken(userToUpdate, browserInfo, email);
    }

    const result = await this.prisma.user.update({
      where: searchDetails,
      data: {
        ...rest,
        newEmail: email,
        newEmailConfirmed: email ? false : undefined,
        studentInfo: {
          update:
            userToUpdate.role === Role.STUDENT ? { ...studentInfo } : undefined,
        },
        teacherInfo: {
          update:
            userToUpdate.role === Role.TEACHER ? { ...teacherInfo } : undefined,
        },
      },
      ...this.userIncludeDetails,
    });

    return new UserDto(result);
  }

  private async validateEmailChange(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const userWithEmail = await this.findUnique({ email: updateUserDto.email });
    if (userWithEmail && userWithEmail.id === user.id) {
      throw new SameEmailInputException();
    }
    if (userWithEmail && userWithEmail.id !== user.id) {
      throw new EmailUserExistsException(updateUserDto.email);
    }
  }

  private checkUpdatePermission(
    currentUser: User,
    searchDetails: Prisma.UserWhereUniqueInput,
  ): void {
    if (currentUser.role === Role.ADMIN) {
      return;
    }
    if (currentUser.id !== searchDetails.id) {
      throw new ForbiddenException();
    }
  }

  private async createEmailChangeToken(
    details: Omit<Prisma.EmailChangeTokenCreateInput, 'token' | 'expiresIn'>,
  ): Promise<EmailChangeToken> {
    const { length: tokenLength, expiresIn: tokenExpiresIn } =
      this.config.get<ConfirmationTokenOptions>(
        'authOptions.emailChangeTokenOptions',
      );
    const tokenValue = crypto.randomBytes(tokenLength).toString('hex');
    return this.prisma.emailChangeToken.create({
      data: {
        token: tokenValue,
        expiresIn: new Date(tokenExpiresIn + Date.now()),
        ...details,
      },
    });
  }

  private async sendEmailChangeTokenEmail(
    user: User,
    token: string,
    newEmail?: string,
  ): Promise<void> {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Изменение email',
      template: 'email-change',
      context: {
        fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
        email: newEmail || user.newEmail,
        title: 'Подтверждение смены email',
        linkButtonLink: `${
          this.config.get<DomainOptions>('domainOptions').frontend
        }/change-email/${token}`,
        linkButtonText: 'Изменить email',
      },
    });
  }

  private async createSendEmailChangeToken(
    user: User,
    browserInfo: BrowserInfo,
    newEmail?: string,
  ): Promise<void> {
    const token = await this.createEmailChangeToken({
      user: {
        connect: {
          id: user.id,
        },
      },
      ...browserInfo,
    });

    await this.sendEmailChangeTokenEmail(user, token.token, newEmail);
  }

  private async validateEmailChangeToken(
    tokenValue: string,
  ): Promise<EmailChangeToken> {
    const tokenInfo = await this.prisma.emailChangeToken.findUnique({
      where: { token: tokenValue },
    });
    return HelpersMethods.checkToken(tokenInfo);
  }

  private async disableOtherEmailChangeTokens(userId: number): Promise<void> {
    await this.prisma.emailChangeToken.updateMany({
      where: {
        userId,
        expiresIn: { gt: new Date(Date.now()) },
      },
      data: {
        expiresIn: new Date(Date.now() - 1),
      },
    });
  }
}
