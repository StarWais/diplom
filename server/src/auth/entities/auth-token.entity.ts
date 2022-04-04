import { ApiProperty } from '@nestjs/swagger';
export class AuthTokenEntity {
  @ApiProperty({
    example: 'nhbgy789ikojnihuh73i',
  })
  readonly accessToken: string;

  constructor(partial: Partial<AuthTokenEntity>) {
    Object.assign(this, partial);
  }
}
