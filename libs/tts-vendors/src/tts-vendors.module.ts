import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Listen2itModule } from './listen2it/listen2it.module';

@Module({
  imports: [
    Listen2itModule,
    MongooseModule.forRootAsync({
      connectionName: 'LISTEN2IT_LOCAL_CACHE',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const settings = config.get<MongooseModuleFactoryOptions>(
          'ttsVendors.listen2it.database',
        );

        return { ...settings };
      },
    }),
  ],
})
export class TtsVendorsModule {}
