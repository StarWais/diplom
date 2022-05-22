import { PartialType } from '@nestjs/swagger';

import { CourseCreateDto } from './course-create.dto';

export class CourseUpdateDto extends PartialType(CourseCreateDto) {}
