import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'All aboard the TTS-engine! Next stop: hell';
  }
}
