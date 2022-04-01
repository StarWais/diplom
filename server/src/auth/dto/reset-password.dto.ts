import { PickType } from '@nestjs/swagger';
import { SigninDto } from './signin.dto';

export class PasswordResetDto extends PickType(SigninDto, ['email'] as const) {}
