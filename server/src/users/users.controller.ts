import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindOneParams } from '../common/params/find-one-params';
import {
  BrowserInfo,
  CurrentBrowserInfo,
} from '../decorators/browser-info.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@prisma/client';
import {
  ConfirmEmailChangeDto,
  UpdateUserAvatarDto,
  UpdateUserDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('users')
@ApiTags('Пользователи')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Обновить пользователя',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param() searchParams: FindOneParams,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
    @CurrentUser() currentUser: User,
    @Body() details: UpdateUserDto,
  ) {
    return this.usersService.update(
      searchParams,
      details,
      currentUser,
      browserInfo,
    );
  }

  @ApiOperation({
    summary: 'Обновить аватар пользователя',
  })
  @FormDataRequest()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Patch(':id/avatar')
  async updateAvatar(
    @Param() searchDetails: FindOneParams,
    @Body() details: UpdateUserAvatarDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updateAvatar(searchDetails, currentUser, details);
  }

  @ApiOperation({
    summary: 'Подтвердить изменение email',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('confirm-email-change')
  @HttpCode(HttpStatus.NO_CONTENT)
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
    return this.usersService.sendAnotherEmailChangeToken(
      currentUser,
      browserInfo,
    );
  }
}
