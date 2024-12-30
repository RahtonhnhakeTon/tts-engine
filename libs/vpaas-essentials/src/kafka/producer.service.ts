import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Message } from 'kafkajs';
import { KafkaClient } from './kafka.client';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  connected = false;
  private readonly producer = this.kafka.client.producer();

  constructor(
    private readonly kafka: KafkaClient,
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit() {
    // await this.connect();
  }

  async connect() {
    await this.producer.connect();
    this.connected = true;
  }

  async produce(topic: string, ...messages: Message[]) {
    if (this.connected) {
      await this.producer.connect();
    }
    this.logger.debug(
      `Message Produced on ${topic} topic:`,
      ProducerService.name,
      'produce',
      {
        messages,
      },
    );
    await this.producer.send({
      topic,
      messages,
    });
  }

  async onApplicationShutdown(signal?: string) {
    await this.producer.disconnect();
  }
}
