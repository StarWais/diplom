import { PartialType } from '@nestjs/swagger';
import { OlympicCreateDto } from './olympic-create.dto';

export class OlympicUpdateDto extends PartialType(OlympicCreateDto) {}
