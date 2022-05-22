import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

import { ConfirmEmailDto } from '../dto/request';
import { AuthConfirmService } from '../services';
import { JwtAuthGuard } from '../guards';
import { CurrentBrowserInfo, CurrentUser } from '@common/decorators';
import { BrowserInfo } from '@common/decorators/browser-info.decorator';

@ApiTags('Подтверждение регистрации')
@Controller('auth/confirm')
export class AuthConfirmController {
  constructor(private readonly authConfirmService: AuthConfirmService) {}

  @Post()
  @ApiOperation({
    summary: 'Подтвердить регистрацию',
  })
  @ApiNoContentResponse({
    description: 'Регистрация успешно подтверждена',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirm(@Body() details: ConfirmEmailDto): Promise<void> {
    await this.authConfirmService.confirmRegistration(details);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('resend')
  @ApiOperation({
    summary: 'Отправить заново письмо подтверждения регистрации',
  })
  @ApiAcceptedResponse({
    description: 'Письмо подтверждения регистрации отправлено',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async resend(
    @CurrentUser() user: User,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ): Promise<void> {
    await this.authConfirmService.sendAnotherRegistrationToken(
      user,
      browserInfo,
    );
  }
}
