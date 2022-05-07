import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InfoService } from './info.service';

@ApiTags('Информация')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get('counts')
  @ApiOperation({
    summary: 'Получить количество студентов, преподавателей, олимпиад и курсов',
  })
  getCounts() {
    return this.infoService.getCounts();
  }

  @Get('last-reviews')
  @ApiOperation({
    summary: 'Получить последние 9 отзывов на курсы и олимпиады',
  })
  getLastReviews() {
    return this.infoService.getLastReviews();
  }
}
