import { Client } from '@app/tts-vendors/commons/client';
import { SendRequestOptions } from '@app/tts-vendors/commons/types';
import { l2i_GenerateTtsDto } from '@app/tts-vendors/listen2it/workspace/workspace.dto';
import {
  Workspace,
  WorkspaceModel,
} from '@app/tts-vendors/listen2it/workspace/workspace.model';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosHeaders } from 'axios';
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

    if (settings.baseURL.prod) {
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
    body.voice_id = 'Raveena';
    body.language = 'en-IN';
    body.type = 'ssml';

    if (!(await this._is_body_valid(body))) return null;

    const response = await this._send(workspaceApiReference.generate, {
      method: 'post',
      payload: body,
    });

    if (response.success) {
      return response.data;
    }
    return null;
  }

  protected async _send(pathname: string, options: SendRequestOptions) {
    if (!options.headers) {
      options.headers = new AxiosHeaders();
    }
    options.headers.set('x-api-key', this._workspace.apiKey);
    options.headers.set('workspace-id', this._workspace.workspaceID ?? '');

    return super._send(pathname, options);
  }
}
