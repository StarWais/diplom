import { PartialType } from '@nestjs/swagger';

import { OlympicTaskCreateDto } from './olympic-task-create.dto';

export class OlympicTaskUpdateDto extends PartialType(OlympicTaskCreateDto) {}
