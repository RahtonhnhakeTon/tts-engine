import { HttpExceptionFilter } from '@app/vpaas-essentials/filters/http-exception.filter';
import { Module } from '@nestjs/common';

@Module({
  providers: [HttpExceptionFilter],
  exports: [HttpExceptionFilter],
})
export class FiltersModule {}
