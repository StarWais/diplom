import { Controller } from '@nestjs/common';
import { OlympicsStepAttemptsService } from '@olympics/services';

@Controller()
export class OlympicsStepAttemptsController {
  constructor(
    private readonly olympicsStepAttemptsService: OlympicsStepAttemptsService,
  ) {}
}
