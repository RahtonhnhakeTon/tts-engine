import { GlobalErrorFilter } from '@app/vpaas-essentials/filters/global-error.filter';
import { HttpExceptionFilter } from '@app/vpaas-essentials/filters/http-exception.filter';
import { LoggerInterceptor } from '@app/vpaas-essentials/interceptors/logger.interceptor';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import FastifyListRoutes from 'fastify-list-routes';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerDocumentBuilder } from './swagger/swagger-document-builder';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: false,
      rawBody: true,
    },
  );
  const configService = app.get<ConfigService>(ConfigService);
  const loggerService = new LoggerService(configService);

  app.useLogger(loggerService);
  app.useGlobalFilters(new GlobalErrorFilter(loggerService));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggerInterceptor(configService));
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerDocBuilder = new SwaggerDocumentBuilder(app, configService);
  swaggerDocBuilder.setupSwagger();

  app.useStaticAssets({
    root: join(__dirname, '..', 'assets', 'public'),
    prefix: '/public/',
  });

  await app.register(FastifyListRoutes);
  await app.listen({
    port: configService.get<number>('app.port'),
    host: '0.0.0.0',
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
