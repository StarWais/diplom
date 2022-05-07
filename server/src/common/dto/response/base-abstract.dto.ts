import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseAbstractDto {
  @ApiProperty({
    description: 'ID ресурса',
    type: 'integer',
    example: 1,
  })
  public readonly id: number;
  @ApiProperty({
    description: 'Дата создания ресурса',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  public readonly createdAt: Date;
  @ApiProperty({
    description: 'Дата обновления ресурса',
    type: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  public readonly updatedAt: Date;

  protected constructor(partial: Partial<BaseAbstractDto>) {
    Object.assign(this, partial);
  }
}
