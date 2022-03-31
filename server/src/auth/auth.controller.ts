import { BrowserInfo } from './../decorators/browser-info.decorator';
import { SignupDto } from './dto/signup.dto';
import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { SigninDto } from './dto/signin.dto';
import { AuthToken } from './models/auth-token.entity';
import { User } from '@prisma/client';
import { CurrentBrowserInfo } from 'src/decorators/browser-info.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() details: SignupDto,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ): Promise<AuthToken> {
    return this.authService.signup(details, browserInfo);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SigninDto })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Request() req: any): Promise<AuthToken> {
    return this.authService.signin(req.user as User);
  }
}
