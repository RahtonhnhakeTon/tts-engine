import { TtsVendorsModule } from '@app/tts-vendors';
import { FiltersModule } from '@app/vpaas-essentials/filters/filters.module';
import { InterceptorsModule } from '@app/vpaas-essentials/interceptors/interceptors.module';
import { LoggerModule } from '@app/vpaas-essentials/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppConfiguration from '../config/app.config.js';
import KafkaConfiguration from '../config/kafka.config.js';
import LoggerConfiguration from '../config/logger.config.js';
import VendorConfiguration from '../config/vendors.config.js';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TtsModule } from './tts/tts.module';
import { UserModule } from './user/user.module';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [
    TtsModule,
    TtsVendorsModule,
    LoggerModule,
    FiltersModule,
    InterceptorsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.development.env'],
      load: [
        AppConfiguration,
        VendorConfiguration,
        LoggerConfiguration,
        KafkaConfiguration,
      ],
    }),
    UserModule,
    AudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
