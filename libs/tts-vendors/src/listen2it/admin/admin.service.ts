import { Client } from '@app/tts-vendors/commons/client';
import { SendRequestOptions } from '@app/tts-vendors/commons/types';
import { l2i_CreateOrEditWorkspaceDto } from '@app/tts-vendors/listen2it/admin/admin.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosHeaders } from 'axios';
import { join } from 'path';
import { admin as adminApiReference } from '../api-reference.json';

@Injectable()
export class AdminService extends Client {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    super(http);
    const settings = config.get('listen2it');

    if (settings.baseURL.prod) {
      this.baseURL = settings.baseURL.prod;
      this.basePath = settings.basePath.prod;
    } else {
      this.baseURL = settings.baseURL.sandbox;
      this.basePath = settings.basePath.sandbox;
    }
  }

  createWorkspace(body: l2i_CreateOrEditWorkspaceDto) {
    return this._send(adminApiReference.workspace.default, {
      method: 'post',
      payload: body,
    });
  }

  deleteWorkspace(id: string) {
    return this._send(join(adminApiReference.workspace.default, id), {
      method: 'delete',
    });
  }

  editWorkspace(body: l2i_CreateOrEditWorkspaceDto) {
    return this._send(adminApiReference.workspace.default, {
      method: 'put',
      payload: body,
    });
  }

  getWorkspace(id: string) {
    return this._send(join(adminApiReference.workspace.default, id), {
      method: 'get',
    });
  }

  getAllWorkspaces() {
    return this._send(adminApiReference.workspace.get_multiple, {
      method: 'get',
    });
  }

  protected async _send(pathname: string, options: SendRequestOptions) {
    if (!options.headers) {
      options.headers = new AxiosHeaders();
    }
    options.headers.set(
      'x-api-key',
      this.config.get<string>('listen2it.apiKey'),
    );
    options.headers.set(
      'workspace-id',
      this.config.get<string>('listen2it.parentWorkspaceID'),
    );

    return super._send(pathname, options);
  }
}
