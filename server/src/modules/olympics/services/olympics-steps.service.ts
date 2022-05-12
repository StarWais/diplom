import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OlympicsStepsService {
  constructor(private readonly prisma: PrismaService) {}

  async stepsExist(olympicsId: number, ids: Array<number>) {
    const steps = await this.prisma.olympiadStep.findMany({
      where: {
        olympiadId: olympicsId,
        id: {
          in: ids,
        },
      },
    });
    return steps.length === ids.length;
  }
}
