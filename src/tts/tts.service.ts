import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateTtsDto } from './tts.dto';

@Injectable()
export class TtsService {
  generate(body: GenerateTtsDto) {
    switch (body.vendor) {
      case 'listen2it':
        break;
      case 'aws':
      case 'google':
        throw new HttpException(
          'This feature is not implemented yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }
}
