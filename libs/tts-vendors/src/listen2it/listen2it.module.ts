import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
      HttpModule.register({
          timeout: 10000,
      })
  ],
  providers: [WorkspaceService],
  exports: [WorkspaceService]
})
export class Listen2itModule {}
