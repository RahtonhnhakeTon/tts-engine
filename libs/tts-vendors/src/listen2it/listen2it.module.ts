import { AdminService } from '@app/tts-vendors/listen2it/admin/admin.service';
import {
  Workspace,
  WorkspaceModel,
  WorkspaceSchema,
} from '@app/tts-vendors/listen2it/workspace/workspace.model';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceService } from './workspace/workspace.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
    MongooseModule.forFeature(
      [
        {
          name: Workspace.name,
          schema: WorkspaceSchema,
        },
      ],
      'LISTEN2IT_LOCAL_CACHE',
    ),
  ],
  providers: [WorkspaceService, AdminService, WorkspaceModel],
  exports: [WorkspaceService, AdminService, WorkspaceModel],
})
export class Listen2itModule {}
