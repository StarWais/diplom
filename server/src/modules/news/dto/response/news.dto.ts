import { News } from '@prisma/client';
import { BaseAbstractDto } from '../../../../common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { NewsTagDto } from './news-tag.dto';

export class NewsDto extends BaseAbstractDto implements News {
  @ApiProperty({
    description: 'Заголовок новости',
    type: 'string',
    example: 'Привет мир',
  })
  readonly title: string;

  @ApiProperty({
    description: 'Slug новости',
    type: 'string',
    example: 'privet-mir',
  })
  readonly slug: string;

  @ApiProperty({
    description: 'Описание новости',
    type: 'string',
    example: 'Это приветственная новость',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Ссылка на картинку новости',
    type: 'string',
    example: 'https://example.com/image.jpg',
  })
  readonly imageLink: string;

  @ApiProperty({
    description: 'Текст новости',
    type: 'string',
    example:
      'Это текст новости. Он длинный и в тексте есть много слов, пробелов.',
  })
  readonly content: string;

  @ApiProperty({
    description: 'ID автора новости',
    type: 'number',
    example: 1,
  })
  readonly authorId: number;

  @ApiProperty({
    description: 'Тэги новости',
    type: () => [NewsTagDto],
  })
  readonly tags: Array<NewsTagDto>;

  constructor(partial: Partial<NewsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
