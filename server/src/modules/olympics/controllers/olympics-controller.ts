import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OlympicsService } from '../services';

@Controller('olympics')
@ApiTags('Олимпиады')
export class OlympicsController {
  constructor(private olympicsService: OlympicsService) {}
}
