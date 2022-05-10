import { CourseTag } from '@prisma/client';

import { TagDto } from '../../../../common/dto/response';

export class CourseTagDto extends TagDto implements CourseTag {
  constructor(partial: Partial<CourseTagDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
