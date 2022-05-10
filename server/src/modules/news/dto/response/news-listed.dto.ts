import { NewsDto } from './news.dto';
import { OmitType } from '@nestjs/swagger';

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
