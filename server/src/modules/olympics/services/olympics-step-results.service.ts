import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OlympicsStepResultsService {
  constructor(private readonly prisma: PrismaService) {}
}
