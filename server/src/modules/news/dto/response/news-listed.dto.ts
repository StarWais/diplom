import { OmitType } from '@nestjs/swagger';

import { NewsDto } from './news.dto';

export class NewsListedDto extends OmitType(NewsDto, [
  'content',
  'authorId',
  'tags',
] as const) {
  constructor(partial: Partial<NewsListedDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
