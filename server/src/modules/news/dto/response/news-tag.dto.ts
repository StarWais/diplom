import { NewsTag } from '@prisma/client';

import { TagDto } from '../../../../common/dto/response';

export class NewsTagDto extends TagDto implements NewsTag {
  constructor(partial: Partial<NewsTagDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
