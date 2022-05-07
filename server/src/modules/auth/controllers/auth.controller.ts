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
  ApiBody,
  ApiCreatedResponse,
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
import { SigninDto, SignupDto } from '../dto/request';
import { LocalAuthGuard } from '../guards';
import { AccessTokenDto } from '../dto/response';

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
