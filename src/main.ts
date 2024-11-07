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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import FastifyListRoutes from 'fastify-list-routes';
import { AppModule } from './app.module';

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

  const docBuilderConfig = new DocumentBuilder()
    .setTitle('TTS Engine')
    .setDescription('APIs for the pluggable TTS adapter')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, docBuilderConfig);
  SwaggerModule.setup('api', app, documentFactory);

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
