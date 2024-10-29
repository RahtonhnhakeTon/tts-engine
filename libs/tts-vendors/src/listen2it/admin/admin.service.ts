import { Injectable } from '@nestjs/common';
import {Client} from "@app/tts-vendors/commons/client";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {SendRequestOptions} from "@app/tts-vendors/commons/types";
import {AxiosHeaders} from 'axios';

@Injectable()
export class AdminService extends Client{
    constructor(private readonly http: HttpService,
                private readonly config: ConfigService) {
        super(http);
        this.baseURL = config.get<string>('listen2it.baseURL.main') || config.get<string>('listen2it.baseURL.sandbox');
    }

    protected async _send(pathname: string, options: SendRequestOptions) {
        if(!options.headers) {
            options.headers = new AxiosHeaders();
        }
        options.headers.set('x-api-key', this.config.get<string>('listen2it.apiKey'));

        return super._send(pathname, options);
    }

    createWorkspace(body:)
}
