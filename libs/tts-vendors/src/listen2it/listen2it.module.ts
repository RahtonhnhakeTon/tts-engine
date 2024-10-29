import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace/workspace.service';
import { HttpModule } from "@nestjs/axios";
import {AdminService} from "@app/tts-vendors/listen2it/admin/admin.service";

@Module({
  imports: [
      HttpModule.register({
          timeout: 10000,
      })
  ],
  providers: [WorkspaceService, AdminService],
  exports: [WorkspaceService, AdminService]
})
export class Listen2itModule {}
