import { Module } from '@nestjs/common';
import { TtsVendorsService } from './tts-vendors.service';
import { Listen2itModule } from './listen2it/listen2it.module';

@Module({
  providers: [TtsVendorsService],
  exports: [TtsVendorsService],
  imports: [
      Listen2itModule,
  ],
})
export class TtsVendorsModule {}
