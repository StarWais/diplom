import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { AppModule } from './app/app.module';
import { ValidationPipeOptions } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable config service
  const config = app.get<ConfigService>(ConfigService);

  // enable validation
  const validatorOptions =
    config.get<ValidationPipeOptions>('validatorOptions');
  app.useGlobalPipes(new ValidationPipe(validatorOptions));

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // enable prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const port = config.get<number>('port');

  await app.listen(port);
}
bootstrap();
