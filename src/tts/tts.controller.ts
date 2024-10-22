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
  constructor(private readonly ttsService: TtsService) {}

  @Post('create')
  generate(@Body() body: GenerateTtsDto) {
    try {
      return this.ttsService.generate(body);
    } catch (Error) {
      throw new HttpException(
        'Some error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
