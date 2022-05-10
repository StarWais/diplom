import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseAbstractDto {
  @Expose()
  @ApiProperty({
    description: 'ID ресурса',
    type: 'integer',
    example: 1,
  })
  readonly id: number;

  @Expose()
  @ApiProperty({
    description: 'Дата создания ресурса',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Дата обновления ресурса',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  readonly updatedAt: Date;

  constructor(partial: Partial<BaseAbstractDto>) {
    Object.assign(this, partial);
  }
}
