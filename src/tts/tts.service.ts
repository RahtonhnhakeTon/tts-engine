import { WorkspaceService } from '@app/tts-vendors/listen2it/workspace/workspace.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateTtsDto } from './tts.dto';

@Injectable()
export class TtsService {
  constructor(private readonly l2iWorkspaceService: WorkspaceService) {}

  async generate(body: GenerateTtsDto) {
    switch (body.vendor) {
      case 'listen2it':
        this.l2iWorkspaceService.workspaceID = body.workspace_id;
        //return await this.l2iWorkspaceService.generateTTS({});
        break;
      case 'aws':
      case 'google':
        throw new HttpException(
          'This feature is not implemented yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }
}
