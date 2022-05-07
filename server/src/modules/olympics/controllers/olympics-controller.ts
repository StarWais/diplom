import { OlympicsService } from '../services';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('olympics')
@ApiTags('Олимпиады')
export class OlympicsController {
  constructor(private olympicsService: OlympicsService) {}
}
