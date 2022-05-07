import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ConfirmPasswordResetDto, PasswordResetDto } from '../dto/request';
import { AuthResetService } from '../services';
import { CurrentBrowserInfo } from '../../../common/decorators';
import { BrowserInfo } from '../../../common/decorators/browser-info.decorator';

@ApiTags('Авторизация')
@Controller('auth/reset')
export class AuthResetController {
  constructor(private readonly authResetService: AuthResetService) {}

  @Post()
  @ApiOperation({
    summary: 'Изменить пароль',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'Письмо смены пароля отправлено',
  })
  async resetPassword(
    @Body() details: PasswordResetDto,
    @CurrentBrowserInfo() browserInfo: BrowserInfo,
  ): Promise<void> {
    await this.authResetService.resetPassword(details, browserInfo);
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Подтвердить изменение пароля',
  })
  @ApiNoContentResponse({
    description: 'Пароль успешно изменен',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordReset(
    @Body() details: ConfirmPasswordResetDto,
  ): Promise<void> {
    await this.authResetService.confirmPasswordReset(details);
  }
}
