import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { InfoService } from '../services';
import { InfoCountsDto, InfoReviewDto } from '../dto/response';

@ApiTags('Информация')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get('counts')
  @ApiOperation({
    summary: 'Получить количество студентов, преподавателей, олимпиад и курсов',
  })
  @ApiOkResponse({
    type: InfoCountsDto,
    description: 'Количество студентов, преподавателей, олимпиад и курсов',
  })
  async counts(): Promise<InfoCountsDto> {
    return this.infoService.counts();
  }

  @Get('last-reviews')
  @ApiOperation({
    summary: 'Получить последние 9 отзывов на курсы и олимпиады',
  })
  @ApiOkResponse({
    type: InfoReviewDto,
    isArray: true,
    description: 'Последние 9 отзывов на курсы и олимпиады',
  })
  async lastReviews(): Promise<Array<InfoReviewDto>> {
    return this.infoService.lastReviews();
  }
}
