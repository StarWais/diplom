import { Olympiad, OlympiadParticipationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BaseAbstractDto } from '@common/dto/response';
import { OlympicTagDto } from './olympic-tag.dto';

export class OlympicDto extends BaseAbstractDto implements Olympiad {
  @Expose()
  @ApiProperty({
    description: 'Название олимпиады',
    example: 'Олимпиада по информатике',
    type: 'string',
  })
  readonly name: string;

  @Expose()
  @ApiProperty({
    description: 'Формат олимпиады',
    example: 'Дистанционно',
    type: 'string',
  })
  readonly format: string;

  @Expose()
  @ApiProperty({
    description: 'Тип олимпиады',
    example: OlympiadParticipationType.FREE,
    enum: OlympiadParticipationType,
  })
  readonly participationType: OlympiadParticipationType;

  @Expose()
  @ApiProperty({
    description: 'Класс олимпиады',
    example: 10,
    type: 'integer',
  })
  readonly grade: number;

  @Expose()
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

  @Expose()
  @ApiProperty({
    description: 'Награды олимпиады',
    isArray: true,
    type: 'string',
    example: ['Награда1', 'Награда2', 'Награда3'],
  })
  readonly rewards: string[];

  @Expose()
  @ApiProperty({
    description: 'Рейтинг олимпиады',
    example: 4.5,
    type: 'integer',
  })
  readonly rating: number;

  @Expose()
  @ApiProperty({
    description: 'Ссылка на картинку олимпиады',
    example: 'https://example.com/image.jpg',
    type: 'string',
  })
  readonly imageLink: string;

  @Expose()
  @ApiProperty({
    type: () => OlympicTagDto,
    isArray: true,
    description: 'Теги олимпиады',
  })
  readonly tags: OlympicTagDto[];

  constructor(partial: Partial<OlympicDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
