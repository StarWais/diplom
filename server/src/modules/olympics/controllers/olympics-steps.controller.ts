import { OlympicsStepsService } from '@olympics/services';
import { Controller } from '@nestjs/common';

@Controller()
export class OlympicsStepsController {
  constructor(private readonly olympicsStepsService: OlympicsStepsService) {}
}
