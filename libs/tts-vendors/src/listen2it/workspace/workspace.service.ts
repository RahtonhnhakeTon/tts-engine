import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { workspace as workspaceApiReference } from '../api-reference.json';
import { Client } from '@app/tts-vendors/commons/client';
import { l2i_GenerateTtsDto } from '@app/tts-vendors/listen2it/workspace/workspace.dto';
import { SendRequestOptions } from '@app/tts-vendors/commons/types';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';

@Injectable()
export class WorkspaceService extends Client {
  private _workspace_id: string = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    super(http);
    this.baseURL =
      config.get<string>('listen2it.baseURL.main') ||
      config.get<string>('listen2it.baseURL.sandbox');
  }

  set workspaceID(value: string) {
    this._workspace_id = value;
  }

  protected async _send(pathname: string, options: SendRequestOptions) {
    if (!options.headers) {
      options.headers = new AxiosHeaders();
    }
    options.headers.set(
      'x-api-key',
      this.config.get<string>('listen2it.apiKey'),
    );
    options.headers.set('workspace-id', this._workspace_id ?? '');

    return super._send(pathname, options);
  }

  generateTTS(body: l2i_GenerateTtsDto) {
    return this._send(workspaceApiReference.generate, {
      method: 'post',
      payload: body,
    });
  }
}
