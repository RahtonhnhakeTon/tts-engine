import { Listen2itModule } from '@app/tts-vendors/listen2it/listen2it.module';
import { Module } from '@nestjs/common';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';

@Module({
  imports: [Listen2itModule],
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}
