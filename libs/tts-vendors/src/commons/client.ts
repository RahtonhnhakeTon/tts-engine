import { SendRequestOptions } from '@app/tts-vendors/commons/types';
import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { validate } from 'class-validator';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class Client {
  private readonly abortController = new AbortController();
  private _base_url: string;
  private _base_path: string;

  constructor(
    private readonly httpClient: HttpService,
    private readonly log: LoggerService,
  ) {}

  set baseURL(value: string) {
    this._base_url = value;
  }

  set basePath(value: string) {
    this._base_path = value;
  }

  protected async _send(pathname: string, options: SendRequestOptions) {
    try {
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

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        this.log.error(
          `API (${err.config.method}) ${pathname} failed with status ${err.status}` +
            `\n${JSON.stringify(err.response.data)}`,
          err,
          'HttpClient',
          '_send',
        );
        return err.response.data;
      } else
        this.log.error(
          'An error occurred while hitting API',
          err,
          'HttpClient',
          '_send',
        );
      return {};
    }
  }

  protected async _is_body_valid(body: any) {
    const errors = await validate(body);
    if (errors.length > 0) {
      console.log('validation failed. errors: ', errors);
      return false;
    }
    return true;
  }
}
