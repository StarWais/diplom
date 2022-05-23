import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OlympicsTasksVariantsService {
  constructor(private readonly prisma: PrismaService) {}
}
