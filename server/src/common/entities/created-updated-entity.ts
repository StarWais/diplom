import { ApiProperty } from '@nestjs/swagger';
export class CreatedUpdatedEntity {
  @ApiProperty({
    type: 'date-time',
    example: Date.now(),
  })
  createdAt: Date;
  @ApiProperty({
    type: 'date-time',
    example: Date.now(),
  })
  updatedAt: Date;

  constructor(partial: Partial<CreatedUpdatedEntity>) {
    Object.assign(this, partial);
  }
}
