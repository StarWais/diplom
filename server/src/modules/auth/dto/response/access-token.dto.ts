import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccessTokenDto {
  @Expose()
  @ApiProperty({
    description: 'Токен доступа',
    example: '172jhuejnfskeifushegse87fh',
  })
  readonly accessToken: string;

  constructor(partial: Partial<AccessTokenDto>) {
    Object.assign(this, partial);
  }
}
