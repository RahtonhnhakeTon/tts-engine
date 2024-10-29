import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TtsModule } from './tts/tts.module';
import {TtsVendorsModule} from "@app/tts-vendors";
import {ConfigModule} from "@nestjs/config";
import VendorConfiguration from "@app/tts-vendors/config/vendors.config";

@Module({
  imports: [
    TtsModule,
    TtsVendorsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.development.env'],
      load: [ VendorConfiguration ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
