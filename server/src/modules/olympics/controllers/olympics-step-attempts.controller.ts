import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OlympicsStepAttemptsService } from '@olympics/services';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindByOlympicsStepIdParams,
  FindOlympicStepAttemptParams,
  FindOlympicStepParams,
} from '@olympics/params';
import {
  OlympicReviewDto,
  OlympicStepAttemptDto,
} from '@olympics/dto/response';
import { PaginationQuery } from '@pagination/pagination-query';
import { OlympicStepAttemptCreateDto } from '@olympics/dto/request';
import { CurrentUser } from '@common/decorators';
import { Role, User } from '@prisma/client';
import { ApiPaginatedResponse, PaginatedDto } from '@pagination/pagination';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@auth/guards';

@Controller('olympics/:olympicsId/steps/:stepId/attempts')
@ApiTags('Попытки завершения этапа олимпиады')
export class OlympicsStepAttemptsController {
  constructor(
    private readonly olympicsStepAttemptsService: OlympicsStepAttemptsService,
  ) {}

  @Get(':id')
  @Get()
  @ApiOperation({
    summary: 'Получить попытку завершения этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiOkResponse({
    type: OlympicStepAttemptDto,
    description: 'Попытка завершения этапа олимпиады',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(
    @Param() searchParams: FindOlympicStepAttemptParams,
  ): Promise<OlympicStepAttemptDto> {
    return this.olympicsStepAttemptsService.findOneOrThrowError(searchParams);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список попыток завершения этапа олимпиады',
    description: 'Доступно только администратору',
  })
  @ApiPaginatedResponse(OlympicStepAttemptDto)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findMany(
    @Param() searchParams: FindOlympicStepParams,
    @Query() filter: PaginationQuery,
  ): Promise<PaginatedDto<OlympicStepAttemptDto>> {
    return this.olympicsStepAttemptsService.findMany(searchParams, filter);
  }

  @Post()
  @ApiOperation({
    summary: 'Добавить попытку завершения этапа олимпиады',
    description: 'Доступно только студенту',
  })
  @ApiCreatedResponse({
    description: 'Попытка решения этапа олимпиады успешно добавлена',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Param() searchParams: FindOlympicStepParams,
    @Body() details: OlympicStepAttemptCreateDto,
    @CurrentUser() currentUser: User,
  ): Promise<void> {
    await this.olympicsStepAttemptsService.create(
      searchParams,
      details,
      currentUser,
    );
  }
}
