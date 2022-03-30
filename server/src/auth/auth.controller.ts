import { UserEntity } from './../users/models/user.entity';
import { SignupDto } from './dto/signup.dto';
import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  UseGuards,
  Request,
  Ip,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import * as parseUserAgent from 'ua-parser-js';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { SigninDto } from './dto/signin.dto';
import { AuthToken } from './models/auth-token.entity';
import { User } from '@prisma/client';
import { Request as RequestType } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() details: SignupDto,
    @Ip() ip: string,
    @Request() request: RequestType,
  ): Promise<UserEntity> {
    const parsedUserAgent = parseUserAgent(request.headers['user-agent']);
    return new UserEntity(
      await this.authService.signup(
        details,
        ip.replace('::ffff:', ''),
        parsedUserAgent.browser.name,
      ),
    );
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SigninDto })
  @Post('signin')
  async signin(@Request() req): Promise<AuthToken> {
    return this.authService.signin(req.user as User);
  }
}
