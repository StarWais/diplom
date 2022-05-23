import { Controller } from '@nestjs/common';
import { OlympicsTasksService } from '@olympics/services';

@Controller()
export class OlympicsTasksController {
  constructor(private readonly olympicsTasksService: OlympicsTasksService) {}
}
