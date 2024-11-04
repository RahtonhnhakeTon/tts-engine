import { LoggerInterceptor } from '@app/vpaas-essentials/interceptors/logger.interceptor';
import { Module } from '@nestjs/common';

@Module({
  providers: [LoggerInterceptor],
  exports: [LoggerInterceptor],
})
export class InterceptorsModule {}
