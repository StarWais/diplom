import { ApiProperty } from '@nestjs/swagger';
export class AuthToken {
  @ApiProperty({
    example: 'nhbgy789ikojnihuh73i',
  })
  readonly accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
