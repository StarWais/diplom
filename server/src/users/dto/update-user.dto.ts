import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { SignupDto } from '../../auth/dto';
import { IsDate, IsOptional, IsPhoneNumber } from 'class-validator';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class UpdateUserDto extends PartialType(
  PickType(SignupDto, [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'gender',
  ] as const),
) {
  @ApiProperty({
    required: false,
    type: 'date-time',
    example: Date.now(),
  })
  @IsOptional()
  @IsDate()
  readonly birthDate?: Date;

  @ApiProperty({
    required: false,
    example: '+375291234567',
  })
  @IsOptional()
  @IsPhoneNumber('BY')
  readonly phone?: string;

  @IsOptional()
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
  ])
  readonly avatar?: FileSystemStoredFile;
}
