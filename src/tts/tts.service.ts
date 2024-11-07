import { WorkspaceService } from '@app/tts-vendors/listen2it/workspace/workspace.service';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateTtsDto } from './tts.dto';

@Injectable()
export class TtsService {
  constructor(
    private readonly l2iWorkspaceService: WorkspaceService,
    private readonly logger: LoggerService,
  ) {}

  async generate(@Body() body: GenerateTtsDto) {
    switch (body.vendor) {
      case 'listen2it':
        if (
          await this.l2iWorkspaceService.setWorkspaceByAccountId(body.userId)
        ) {
          this.logger.log(
            `workspace for user id: ${body.userId} located successfully`,
            TtsService.name,
            'generate',
          );
        } else {
          throw new HttpException(
            `Provided user id is not integrated for listen2it. Please setup the account using v1/user/setup API`,
            HttpStatus.NOT_ACCEPTABLE,
          );
        }

        return this.l2iWorkspaceService.generateTTS({
          text: body.text,
          language: body.language,
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
