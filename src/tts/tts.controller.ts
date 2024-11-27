import * as NestCommons from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { GenerateTtsDto, TtsVendors } from './tts.dto';
import { TtsService } from './tts.service';

@ApiTags('TTS')
@Controller({
  path: 'tts',
  version: '1',
})
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

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
