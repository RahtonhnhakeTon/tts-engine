import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, EachMessageHandler } from 'kafkajs';
import { KafkaClient } from './kafka.client';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: Consumer[] = [];

  constructor(private readonly kafka: KafkaClient) {}

  async consume(
    onMessage: EachMessageHandler,
    options: KafkaConsumerConfiguration,
    runConfig: ConsumerRunConfig = {},
  ) {
    const consumer = this.kafka.client.consumer(options.group);
    await consumer.subscribe({ topic: options.topic });
    await consumer.run({
      ...options.runConfig,
      ...runConfig,
      eachMessage: onMessage,
    });

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    this.consumers.forEach((consumer) => {
      consumer.disconnect();
    });
  }
}

export type KafkaConsumerConfiguration = {
  group: {
    groupId: string;
  };
  runConfig: ConsumerRunConfig;
  topic: string;
};
