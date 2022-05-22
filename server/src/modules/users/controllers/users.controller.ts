import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ConfirmEmailChangeDto,
  UpdateUserAvatarDto,
  UpdateUserDto,
} from '../dto/request';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Role, User } from '@prisma/client';

import { UsersService } from '../services';
import { FindOneByIDParams } from '@common/params';
import {
  BrowserInfo,
  CurrentBrowserInfo,
} from '@common/decorators/browser-info.decorator';
import { CurrentUser } from '@common/decorators';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';
import { Roles } from '@auth/decorators/roles.decorator';
import { UsersGetFilter } from '../filters/users-get.filter';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { UserDto, UserListedDto } from '../dto/response';

@Controller('users')
@ApiTags('Пользователи')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Получить список пользователей',
    description: 'Доступно только администратору',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiPaginatedResponse(UserListedDto)
  @ApiBearerAuth()
  @Get()
  async findMany(
    @Query() filter: UsersGetFilter,
  ): Promise<PaginatedDto<UserListedDto>> {
    return this.usersService.findMany(filter);
  }

  @ApiOperation({
    summary: 'Обновить пользователя',
  })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto, description: 'Обновленный пользователь' })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param() searchParams: FindOneByIDParams,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
    @CurrentUser() currentUser: User,
    @Body() details: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(
      searchParams,
      details,
      currentUser,
      browserInfo,
    );
  }

  @ApiOperation({
    summary: 'Получить данные о себе',
  })
  @ApiOkResponse({ type: UserDto, description: 'Данные о себе' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@CurrentUser() currentUser: User): Promise<UserDto> {
    return this.usersService.findUniqueOrThrowError({ id: currentUser.id });
  }

  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Получить данные о пользователе',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({ type: UserDto, description: 'Данные о пользователе' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param() searchParams: FindOneByIDParams): Promise<UserDto> {
    return this.usersService.findUniqueOrThrowError(searchParams);
  }

  @ApiOperation({
    summary: 'Обновить аватар пользователя',
  })
  @FormDataRequest()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: 'string',
    description: 'Ссылка на обновленный аватар',
  })
  @Patch(':id/avatar')
  async updateAvatar(
    @Param() searchDetails: FindOneByIDParams,
    @Body() details: UpdateUserAvatarDto,
    @CurrentUser() currentUser: User,
  ): Promise<string> {
    return this.usersService.updateAvatar(searchDetails, currentUser, details);
  }

  @ApiOperation({
    summary: 'Подтвердить изменение email',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('confirm-email-change')
  async confirmEmailChangeToken(@Body() details: ConfirmEmailChangeDto) {
    return this.usersService.confirmEmailChange(details);
  }

  @ApiOperation({
    summary: 'Отправить новое подтверждение изменения email',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('resend-email-change')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmailChangeToken(
    @CurrentUser() currentUser: User,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ) {
    await this.usersService.sendAnotherEmailChangeToken(
      currentUser,
      browserInfo,
    );
  }
}
