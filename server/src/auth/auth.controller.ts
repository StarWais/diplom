import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { CurrentUser } from './../decorators/current-user.decorator';
import {
  BrowserInfo,
  CurrentBrowserInfo,
} from './../decorators/browser-info.decorator';
import { AuthToken } from './models/auth-token.entity';
import {
  ConfirmEmailDto,
  ConfirmPasswordResetDto,
  PasswordResetDto,
  SigninDto,
  SignupDto,
} from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    type: AuthToken,
  })
  async signup(
    @Body() details: SignupDto,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ): Promise<AuthToken> {
    return this.authService.signup(details, browserInfo);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    type: AuthToken,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Request() req: any): Promise<AuthToken> {
    return this.authService.signin(req.user as User);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirm(@Body() details: ConfirmEmailDto): Promise<void> {
    return this.authService.confirmRegistration(details);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('confirm/resend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendRegistrationConfirmation(
    @CurrentUser() user: User,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ): Promise<void> {
    return this.authService.sendAnotherRegistrationToken(user, browserInfo);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async resetPassword(
    @Body() details: PasswordResetDto,
    @CurrentBrowserInfo() broswerInfo: BrowserInfo,
  ): Promise<void> {
    return this.authService.resetPassword(details, broswerInfo);
  }

  @Post('confirm-password-reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordReset(@Body() details: ConfirmPasswordResetDto) {
    return this.authService.confirmPasswordReset(details);
  }
}
