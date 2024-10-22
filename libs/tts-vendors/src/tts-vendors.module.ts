import { Module } from '@nestjs/common';
import { TtsVendorsService } from './tts-vendors.service';
import { Listen2itModule } from './listen2it/listen2it.module';
import { ConfigModule } from "@nestjs/config";
import Configuration from "./config/vendors";

@Module({
  providers: [TtsVendorsService],
  exports: [TtsVendorsService],
  imports: [
      Listen2itModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['.env', '.development.env'],
        load: [ Configuration ],
      }),
  ],
})
export class TtsVendorsModule {}
