import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import {
  BrowserInfo,
  CurrentBrowserInfo,
} from '../decorators/browser-info.decorator';
import {
  ConfirmEmailDto,
  ConfirmPasswordResetDto,
  PasswordResetDto,
  SigninDto,
  SignupDto,
} from './dto/request';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Зарегистрироваться',
  })
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() details: SignupDto,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ) {
    return this.authService.signup(details, browserInfo);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SigninDto })
  @ApiOperation({
    summary: 'Войти',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Request() req: any) {
    return this.authService.signin(req.user as User);
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Подтвердить регистрацию',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirm(@Body() details: ConfirmEmailDto) {
    await this.authService.confirmRegistration(details);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('confirm/resend')
  @ApiOperation({
    summary: 'Отправить заново письмо подтверждения регистрации',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async resendRegistrationConfirmation(
    @CurrentUser() user: User,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ) {
    await this.authService.sendAnotherRegistrationToken(user, browserInfo);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Изменить пароль',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async resetPassword(
    @Body() details: PasswordResetDto,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ) {
    await this.authService.resetPassword(details, browserInfo);
  }

  @Post('confirm-password-reset')
  @ApiOperation({
    summary: 'Подтвердить изменение пароля',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordReset(@Body() details: ConfirmPasswordResetDto) {
    await this.authService.confirmPasswordReset(details);
  }
}
