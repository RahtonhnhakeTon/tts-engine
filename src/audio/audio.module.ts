import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}
