import { Controller } from '@nestjs/common';
import { OlympicsTasksAttemptsService } from '@olympics/services';

@Controller()
export class OlympicsTasksAttemptsController {
  constructor(
    private readonly olympicsTasksAttemptsService: OlympicsTasksAttemptsService,
  ) {}
}
