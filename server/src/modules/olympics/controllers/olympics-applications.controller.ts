import { OlympicsApplicationsService } from '@olympics/services';
import { Controller } from '@nestjs/common';

@Controller()
export class OlympicsApplicationsController {
  constructor(
    private readonly olympicsApplicationsService: OlympicsApplicationsService,
  ) {}
}
