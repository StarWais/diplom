import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OlympicsTasksAttemptsService {
  constructor(private readonly prisma: PrismaService) {}
}
