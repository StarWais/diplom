import { OlympicsReviewsService } from '@olympics/services';
import { Controller } from '@nestjs/common';

@Controller()
export class OlympicsReviewsController {
  constructor(
    private readonly olympicsReviewsService: OlympicsReviewsService,
  ) {}
}
