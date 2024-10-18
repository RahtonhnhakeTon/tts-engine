import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import FastifyListRoutes from 'fastify-list-routes';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: false,
      rawBody: true,
    },
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.register(FastifyListRoutes);
  await app.listen({
    port: 3000,
    host: '0.0.0.0',
  });
}
bootstrap();
