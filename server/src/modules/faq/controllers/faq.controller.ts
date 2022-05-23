import { FaqService } from '../services';
import { Controller } from '@nestjs/common';

@Controller()
export class FaqController {
  constructor(private readonly faqService: FaqService) {}
}
