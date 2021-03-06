import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import {
  DomainOptions,
  SwaggerOptions,
  ValidationPipeOptions,
} from '@config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable config service
  const config = app.get<ConfigService>(ConfigService);

  // enable validation
  const validatorOptions =
    config.get<ValidationPipeOptions>('validatorOptions');

  app.useGlobalPipes(new ValidationPipe(validatorOptions));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // enable prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // enable swagger configuration
  const swaggerConfigOptions = config.get<SwaggerOptions>('swaggerOptions');
  const SwaggerOptions = new DocumentBuilder()
    .setTitle(swaggerConfigOptions.title)
    .setDescription(swaggerConfigOptions.description)
    .setVersion(swaggerConfigOptions.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, SwaggerOptions);

  SwaggerModule.setup(swaggerConfigOptions.swaggerPath, app, document);

  const port = config.get<number>('port');

  // enable cors
  app.enableCors({
    credentials: true,
    origin: config.get<DomainOptions>('domainOptions').frontend,
  });

  //enable helmet
  app.use(helmet());

  await app.listen(port);
}

bootstrap();
