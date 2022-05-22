import { OlympiadTag } from '@prisma/client';

import { TagDto } from '@common/dto/response';

export class OlympicTagDto extends TagDto implements OlympiadTag {}
