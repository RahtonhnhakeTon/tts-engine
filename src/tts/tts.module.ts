import { Listen2itModule } from '@app/tts-vendors/listen2it/listen2it.module';
import { LoggerModule } from '@app/vpaas-essentials/logger/logger.module';
import { Module } from '@nestjs/common';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';

@Module({
  imports: [Listen2itModule, LoggerModule],
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}
