import { WorkspaceService } from '@app/tts-vendors/listen2it/workspace/workspace.service';
import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateTtsDto } from './tts.dto';

@Injectable()
export class TtsService {
  constructor(private readonly l2iWorkspaceService: WorkspaceService) {}

  async generate(@Body() body: GenerateTtsDto) {
    switch (body.vendor) {
      case 'listen2it':
        await this.l2iWorkspaceService.setWorkspaceByAccountId(body.userId);

        return this.l2iWorkspaceService.generateTTS({
          text: body.text,
        });
      case 'aws':
      case 'google':
        throw new HttpException(
          'This feature is not implemented yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }
}
