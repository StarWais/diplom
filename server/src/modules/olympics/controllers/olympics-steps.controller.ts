import { OlympicsStepsService } from '@olympics/services';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindOlympicStepParams } from '@olympics/params';
import { OlympicReviewDto, OlympicStepDto } from '@olympics/dto/response';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';

@Controller('olympics/:olympicsId/steps')
@ApiTags('Этапы олимпиады')
export class OlympicsStepsController {
  constructor(private readonly olympicsStepsService: OlympicsStepsService) {}

  @Get(':stepId')
  @ApiOperation({
    summary: 'Получить этап олимпиады',
    description: 'Доступно только студенту',
  })
  @ApiOkResponse({
    description: 'Этап олимпиады',
    type: OlympicStepDto,
  })
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(
    @Param() searchParams: FindOlympicStepParams,
  ): Promise<OlympicStepDto> {
    return this.olympicsStepsService.findOneOrThrowError(searchParams);
  }
}
