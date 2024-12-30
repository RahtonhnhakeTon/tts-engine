import { LoggerModule } from '@app/vpaas-essentials/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { KafkaClient } from './kafka.client';
import { ProducerService } from './producer.service';

@Module({
  imports: [LoggerModule],
  providers: [ProducerService, ConsumerService, KafkaClient],
  exports: [ProducerService, ConsumerService, KafkaClient],
})
export class KafkaModule {}
