import { Body, Controller, Post } from '@nestjs/common';
import { GenerateTtsDto } from './tts.dto';
import { TtsService } from './tts.service';

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
}
