import { IntersectionType } from '@nestjs/swagger';
import { FindOlympicStepParams } from '@olympics/params/find-olympic-step.params';
import { FindOneByIDParams } from '@common/params';

export class FindOlympicStepAttemptParams extends IntersectionType(
  FindOlympicStepParams,
  FindOneByIDParams,
) {}
