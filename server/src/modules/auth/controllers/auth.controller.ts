import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

import { AuthService } from '../services';
import {
  BrowserInfo,
  CurrentBrowserInfo,
} from '../../../common/decorators/browser-info.decorator';
import { ChangePasswordDto, SigninDto, SignupDto } from '../dto/request';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { AccessTokenDto } from '../dto/response';
import { CurrentUser } from '../../../common/decorators';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Зарегистрироваться',
  })
  @ApiCreatedResponse({
    description: 'Пользователь успешно зарегистрирован',
    type: AccessTokenDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() details: SignupDto,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ): Promise<AccessTokenDto> {
    return this.authService.signup(details, browserInfo);
  }

  @Post('password')
  @ApiOperation({
    summary: 'Изменить пароль',
  })
  @ApiNoContentResponse({
    description: 'Пароль успешно изменен',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Body() details: ChangePasswordDto,
    @CurrentUser() currentUser: User,
  ): Promise<void> {
    return this.authService.changePassword(details, currentUser);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SigninDto })
  @ApiOperation({
    summary: 'Войти',
  })
  @ApiOkResponse({
    description: 'Пользователь успешно вошел',
    type: AccessTokenDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Request() req: any): Promise<AccessTokenDto> {
    return this.authService.signin(req.user as User);
  }
}
