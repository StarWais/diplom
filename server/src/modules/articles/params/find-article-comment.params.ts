import { IntersectionType } from '@nestjs/swagger';

import { FindByArticleIdParams } from './find-by-articleId.params';
import { FindOneByIDParams } from '../../../common/params';

export class FindArticleCommentParams extends IntersectionType(
  FindByArticleIdParams,
  FindOneByIDParams,
) {}
