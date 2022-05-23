import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OlympicsTasksService {
  constructor(private readonly prisma: PrismaService) {}
}
