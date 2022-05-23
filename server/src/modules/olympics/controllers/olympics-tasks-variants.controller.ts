import { Controller } from '@nestjs/common';
import { OlympicsTasksVariantsService } from '@olympics/services';

@Controller()
export class OlympicsTasksVariantsController {
  constructor(
    private readonly olympicsTasksVariantsService: OlympicsTasksVariantsService,
  ) {}
}
