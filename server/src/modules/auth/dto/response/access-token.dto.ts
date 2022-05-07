import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description: 'Токен доступа',
    example: '172jhuejnfskeifushegse87fh',
  })
  accessToken: string;
}
