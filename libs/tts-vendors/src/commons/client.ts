import { SendRequestOptions } from '@app/tts-vendors/commons/types';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class Client {
  private readonly abortController = new AbortController();
  private _base_url: string;
  private _base_path: string;

  constructor(private readonly httpClient: HttpService) {}

  set baseURL(value: string) {
    this._base_url = value;
  }

  set basePath(value: string) {
    this._base_path = value;
  }

  protected async _send(pathname: string, options: SendRequestOptions) {
    const response = await lastValueFrom(
      this.httpClient
        .request({
          url: new URL(
            join(this._base_path, pathname),
            this._base_url,
          ).toString(),
          method: options.method || 'get',
          data: options.payload || null,
          signal: this.abortController.signal,
          headers: options.headers,
          auth: options.authorization,
        } as AxiosRequestConfig)
        .pipe(),
    );

    return response;
  }
}
