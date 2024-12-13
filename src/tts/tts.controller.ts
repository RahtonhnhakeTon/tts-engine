import {
  ConsumerService,
  KafkaConsumerConfiguration,
} from '@app/vpaas-essentials/kafka/consumer.service';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import * as NestCommons from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Param,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { Audio } from '../audio/audio.schema';
import { AudioService } from '../audio/audio.service';
import { GenerateTtsDto, TtsVendors } from './tts.dto';
import { TtsService } from './tts.service';

@ApiTags('TTS')
@Controller({
  path: 'tts',
  version: '1',
})
export class TtsController implements OnModuleInit {
  constructor(
    private readonly audioService: AudioService,
    private readonly ttsService: TtsService,
    private readonly consumerService: ConsumerService,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(async (payload) => {
      const messageObject = JSON.parse(payload.message.value.toString());
      try {
        this.logger.log(
          'message consumed:\n' + JSON.stringify(messageObject, null, 2),
          TtsService.name,
          'onEachMessage',
        );
        this.messageHandler(messageObject).catch((err) => {
          this.logger.error(
            'unhandled exception at eachMessage handler of topic: ' +
              payload.topic,
            err,
            TtsService.name,
          );
        });
      } catch (error) {
        this.logger.error(
          'unhandled exception at eachMessage handler of topic: ' +
            payload.topic,
          error,
          TtsService.name,
        );
      }
    }, this.config.get<KafkaConsumerConfiguration>('kafka.consumer'));
  }

  async messageHandler(message: any) {
    if (message.command) {
      switch (message.command.tag) {
        case 'speak':
          await this.generateAndStoreForAsterisk(message.command);
          break;
      }
    }
  }

  async generateAndStoreForAsterisk(body: any) {
    const ttsResponse = await this.ttsService.generate({
      vendor: 'listen2it',
      text: body.text,
      language: body.language,
      voiceId: body.voiceId,
      userId: body.accountId,
    });

    const filename = `${body.accountId}_${body.voiceId}_${ttsResponse.url.split('/').at(-1)}`;

    const file = new Audio({
      name: filename + '.raw',
      path: this.config.get<string>('volumes.ttsStore'),
    });

    await this.audioService.fetchOverHTTP(file, ttsResponse.url);
    await this.audioService.resampleForAsteriskStandards(file, filename);

    return {};
  }

  @Post('create')
  async generate(@Body() body: GenerateTtsDto) {
    const response = await this.ttsService.generate(body);
    return {
      success: true,
      data: response,
    };
  }

  @Get(':vendor/preview-voice')
  async previewModel(
    @Param('vendor') vendor: TtsVendors,
    @Query('model_path') modelPath: string,
    @Response() response: FastifyReply,
  ) {
    switch (vendor) {
      case 'listen2it':
        return this.ttsService.streamL2iPreview(modelPath, response);
      case 'aws':
      case 'google':
        throw new NestCommons.HttpException(
          'This vendor is not integrated yet',
          NestCommons.HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }
}
