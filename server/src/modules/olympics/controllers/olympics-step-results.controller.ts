import { Controller } from '@nestjs/common';

import { OlympicsStepResultsService } from '@olympics/services';

@Controller()
export class OlympicsStepResultsController {
  constructor(
    private readonly olympicsStepResultsService: OlympicsStepResultsService,
  ) {}
}
