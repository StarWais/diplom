import { ArticleTag } from '@prisma/client';
import { TagDto } from '../../../../common/dto/response';

export class ArticleTagDto extends TagDto implements ArticleTag {
  constructor(partial: Partial<ArticleTagDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
