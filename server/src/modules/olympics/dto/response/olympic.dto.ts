import { OlympiadParticipationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { BaseAbstractDto } from '../../../../common/dto/response';
import { OlympicTagDto } from './olympic-tag.dto';

export class OlympicDto extends BaseAbstractDto {
  @ApiProperty({
    description: 'Название олимпиады',
    example: 'Олимпиада по информатике',
    type: 'string',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Формат олимпиады',
    example: 'Дистанционно',
    type: 'string',
  })
  readonly format: string;

  @ApiProperty({
    description: 'Тип олимпиады',
    example: OlympiadParticipationType.FREE,
    enum: OlympiadParticipationType,
  })
  readonly participationType: OlympiadParticipationType;

  @ApiProperty({
    description: 'Класс олимпиады',
    example: 10,
    type: 'integer',
  })
  readonly grade: number;

  @ApiProperty({
    description: 'Массив картинок предыдущих этапов олимпиады',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    isArray: true,
    type: 'string',
  })
  readonly exampleTasksImages: string[];

  @ApiProperty({
    description: 'Награды олимпиады',
    isArray: true,
    type: 'string',
    example: ['Награда1', 'Награда2', 'Награда3'],
  })
  readonly rewards: string[];

  @ApiProperty({
    isArray: true,
    type: () => [OlympicTagDto],
  })
  readonly tags: OlympicTagDto[];

  constructor(partial: Partial<OlympicDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
