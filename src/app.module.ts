import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TtsModule } from './tts/tts.module';
import {TtsVendorsModule} from "@app/tts-vendors";

@Module({
  imports: [TtsModule, TtsVendorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
