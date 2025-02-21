import { Client } from '@app/tts-vendors/commons/client';
import { SendRequestOptions } from '@app/tts-vendors/commons/types';
import {
  l2i_GenerateTtsDto,
  l2i_TtsGeneratedDto,
} from '@app/tts-vendors/listen2it/workspace/workspace.dto';
import {
  Workspace,
  WorkspaceModel,
} from '@app/tts-vendors/listen2it/workspace/workspace.model';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosHeaders } from 'axios';
import { lastValueFrom } from 'rxjs';
import { workspace as workspaceApiReference } from '../api-reference.json';

@Injectable()
export class WorkspaceService extends Client {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly workspaceModel: WorkspaceModel,
    private readonly logger: LoggerService,
  ) {
    super(http, logger);
    const settings = config.get('ttsVendors.listen2it');

    if (config.get<string>('app.deployment') === 'production') {
      this.baseURL = settings.baseURL.prod;
      this.basePath = settings.basePath.prod;
    } else {
      this.baseURL = settings.baseURL.sandbox;
      this.basePath = settings.basePath.sandbox;
    }
  }

  private _workspace: Workspace = null;

  set workspace(value: Workspace) {
    this._workspace = value;
  }

  async setWorkspaceByAccountId(accountID: number) {
    const workspace = (await this.workspaceModel.findByAccountID(
      accountID,
    )) as Workspace;

    if (workspace) {
      this._workspace = workspace;
      return true;
    }
    return false;
  }

  async generateTTS(body: l2i_GenerateTtsDto) {
    if (!this._workspace) {
      throw new Error('Workspace not set.');
    }
    body.type = 'ssml';

    if (!(await this._is_body_valid(body))) return null;

    const response = await this._send(workspaceApiReference.generate, {
      method: 'post',
      payload: body,
    });

    if (response.success) {
      const successResponse: l2i_TtsGeneratedDto = response.data;
      this.workspaceModel.updateById(this._workspace.workspaceID, {
        usage: successResponse.total_characters_used,
        updatedAt: new Date(),
      });

      return successResponse;
    }
    return null;
  }

  async getVoices() {
    if (!this._workspace) {
      throw new Error('Workspace not set.');
    }

    const response = await this._send(workspaceApiReference.voices);
    if (response.success) {
      return response.data;
    }
    return null;
  }

  async previewVoice(urlpath: string) {
    const baseUrl =
      this.config.get<string>('app.deployment') === 'production'
        ? this.config.get<string>('ttsVendors.listen2it.previewVoiceUrl.prod')
        : this.config.get<string>(
            'ttsVendors.listen2it.previewVoiceUrl.sandbox',
          );
    const url = new URL(urlpath, baseUrl);

    return lastValueFrom(
      this.http
        .request({
          url: url.toString(),
          responseType: 'stream',
        })
        .pipe(),
    );
  }

  protected async _send(pathname: string, options: SendRequestOptions = {}) {
    if (!options.headers) {
      options.headers = new AxiosHeaders();
    }
    options.headers.set('x-api-key', this._workspace.apiKey);
    options.headers.set('workspace-id', this._workspace.workspaceID ?? '');

    return super._send(pathname, options);
  }
}
