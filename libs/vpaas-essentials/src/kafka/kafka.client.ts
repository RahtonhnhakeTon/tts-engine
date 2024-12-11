import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, KafkaConfig } from 'kafkajs';

@Injectable()
export class KafkaClient {
  client: Kafka;

  constructor(private readonly configService: ConfigService) {
    const meta = this.configService.get('kafka');
    const config: KafkaConfig = {
      clientId: meta.clientId,
      brokers: meta.brokers,
      ssl: meta.authType === 'SASL_SSL',
      logCreator: LoggerService.kafkaLog,
    };
    if (config.ssl) {
      // @ts-ignore
      config.sasl = {
        mechanism: meta.credentials.saslMechanism.toLowerCase(),
      };
      if (config.sasl.mechanism === 'plain') {
        // @ts-ignore
        config.sasl.username = meta.credentials.saslUsername;
        // @ts-ignore
        config.sasl.password = meta.credentials.saslPassword;
      }
    }

    this.client = new Kafka(config);
  }
}
