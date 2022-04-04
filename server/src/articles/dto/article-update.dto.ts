import { ArticleCreateDto } from './article-create.dto';
import { PartialType } from '@nestjs/swagger';

export class ArticleUpdateDto extends PartialType(ArticleCreateDto) {}
