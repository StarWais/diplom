import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OlympicsStepAttemptsService {
  constructor(private readonly prisma: PrismaService) {}
}
