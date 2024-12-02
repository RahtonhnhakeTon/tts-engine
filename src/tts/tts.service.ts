import { WorkspaceService } from '@app/tts-vendors/listen2it/workspace/workspace.service';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { GenerateTtsDto } from './tts.dto';

@Injectable()
export class TtsService {
  constructor(
    private readonly l2iWorkspaceService: WorkspaceService,
    private readonly logger: LoggerService,
  ) {}

  async generate(body: GenerateTtsDto) {
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
          voice_id: body.voiceId,
        });
      case 'aws':
      case 'google':
        throw new HttpException(
          'This feature is not implemented yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
    }
  }

  async streamL2iPreview(path: string, response: FastifyReply) {
    try {
      const fileResponse = await this.l2iWorkspaceService.previewVoice(path);
      response.raw.setHeader(
        'Content-Type',
        fileResponse.headers['content-type'] as string,
      );
      response.raw.setHeader(
        'Content-Length',
        fileResponse.headers['content-length'] as string,
      );
      response.raw.setHeader('Content-Disposition', 'inline');

      fileResponse.data.pipe(response.raw);
      response.raw.on('close', () => response.raw.end());
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
