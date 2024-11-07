import { Listen2itModule } from '@app/tts-vendors/listen2it/listen2it.module';
import { LoggerModule } from '@app/vpaas-essentials/logger/logger.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [LoggerModule, Listen2itModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
