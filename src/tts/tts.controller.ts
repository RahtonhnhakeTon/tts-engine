import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GenerateTtsDto } from './tts.dto';
import { TtsService } from './tts.service';

@Controller({
  path: 'tts',
  version: '1',
})
export class TtsController {
  constructor(
    private readonly ttsService: TtsService,
    private readonly logger: LoggerService,
  ) {}

  @Post('create')
  async generate(@Body() body: GenerateTtsDto) {
    try {
      return await this.ttsService.generate(body);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        'Error creating tts',
        error,
        TtsController.name,
        'generate',
      );
      throw new HttpException(
        'Some error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
