import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}
}
