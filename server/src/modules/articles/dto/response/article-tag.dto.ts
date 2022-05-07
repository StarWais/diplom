import { ArticleTag } from '@prisma/client';
import { TagDto } from '../../../../common/dto/response/tag.dto';

export class ArticleTagDto extends TagDto implements ArticleTag {}
