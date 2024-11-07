import { Client } from '@app/tts-vendors/commons/client';
import { SendRequestOptions } from '@app/tts-vendors/commons/types';
import {
  l2i_CreateOrEditWorkspaceDto,
  l2i_Workspace,
  l2i_WorkspaceCreatedDto,
} from '@app/tts-vendors/listen2it/admin/admin.dto';
import { AccountIdAlreadyExistsException } from '@app/tts-vendors/listen2it/admin/admin.exceptions';
import { WorkspaceModel } from '@app/tts-vendors/listen2it/workspace/workspace.model';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
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

  async createWorkspace(
    body: l2i_CreateOrEditWorkspaceDto,
  ): Promise<l2i_WorkspaceCreatedDto> {
    if (!(await this._is_body_valid(body))) return null;

    const response = await this._send(adminApiReference.workspace.default, {
      method: 'post',
      payload: body,
    });

    if (response.success) {
      const successResponse = response.data as l2i_WorkspaceCreatedDto;
      this.getWorkspace(successResponse.id);

      return successResponse;
    } else {
      switch (response.msg) {
        case 'pilot number already exists':
          throw new AccountIdAlreadyExistsException();
      }
    }

    return null;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    const response = await this._send(
      join(adminApiReference.workspace.default, id),
      {
        method: 'delete',
      },
    );

    if (response.success) {
      this.workspaceModel.deleteById(id);
    }
    return response.success;
  }

  async editWorkspace(
    id: string,
    body: l2i_CreateOrEditWorkspaceDto,
  ): Promise<boolean> {
    if (!(await this._is_body_valid(body))) return false;

    const response = await this._send(
      join(adminApiReference.workspace.default, id),
      {
        method: 'put',
        payload: body,
      },
    );

    if (response.success) {
      this.getWorkspace(id);
    }

    return response.success;
  }

  async getWorkspace(id: string): Promise<l2i_Workspace> {
    const response = await this._send(
      join(adminApiReference.workspace.default, id),
      {
        method: 'get',
      },
    );

    if (response.success) {
      this.workspaceModel.cache(response.data);
      return response.data;
    }
    return null;
  }

  async getAllWorkspaces(): Promise<l2i_Workspace[]> {
    const response = await this._send(
      adminApiReference.workspace.get_multiple,
      {
        method: 'get',
      },
    );

    if (response.success) {
      return response.data.map((workspace) =>
        this._transform_response_to_workspace(workspace),
      );
    }
    return [];
  }

  protected _transform_response_to_workspace(response: any) {
    if (response.created_at) {
      response.created_at = new Date(response.created_at);
      response.updated_at = new Date(response.updated_at);
      response.usage.created_at = new Date(response.created_at);
      response.usage.updated_at = new Date(response.updated_at);
    }
    response.account_id = parseInt(response.account_id);

    return response as l2i_Workspace;
  }

  protected async _send(pathname: string, options: SendRequestOptions) {
    if (!options.headers) {
      options.headers = new AxiosHeaders();
    }
    options.headers.set(
      'x-api-key',
      this.config.get<string>('ttsVendors.listen2it.apiKey'),
    );
    options.headers.set(
      'workspace-id',
      this.config.get<string>('ttsVendors.listen2it.parentWorkspaceID'),
    );

    return super._send(pathname, options);
  }
}
