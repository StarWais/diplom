import { PartialType } from '@nestjs/swagger';

import { NewsCreateDto } from './news-create.dto';

export class NewsUpdateDto extends PartialType(NewsCreateDto) {}
