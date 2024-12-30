import { Listen2itModule } from '@app/tts-vendors/listen2it/listen2it.module';
import { KafkaModule } from '@app/vpaas-essentials/kafka/kafka.module';
import { LoggerModule } from '@app/vpaas-essentials/logger/logger.module';
import { Module } from '@nestjs/common';
import { AudioModule } from '../audio/audio.module';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';

@Module({
  imports: [Listen2itModule, LoggerModule, AudioModule, KafkaModule],
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}
