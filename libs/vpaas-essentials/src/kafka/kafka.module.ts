import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { KafkaClient } from './kafka.client';
import { ProducerService } from './producer.service';

@Module({
  imports: [LoggerService],
  providers: [ProducerService, ConsumerService, KafkaClient],
  exports: [ProducerService, ConsumerService, KafkaClient],
})
export class KafkaModule {}
