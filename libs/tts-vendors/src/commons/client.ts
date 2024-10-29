import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {lastValueFrom} from "rxjs";
import {AxiosRequestConfig} from "axios";
import {SendRequestOptions} from "@app/tts-vendors/commons/types";

@Injectable()
export class Client {
    private readonly abortController = new AbortController();
    private _base_url: string;

    set baseURL(value: string) {
        this._base_url = value;
    }

    constructor(private readonly httpClient: HttpService) {
    }

    protected async _send(pathname: string, options: SendRequestOptions) {
        const response = await lastValueFrom(this.httpClient.request({
            url: (new URL(pathname, this._base_url)).toString(),
            method: options.method || 'get',
            data: options.payload || null,
            signal: this.abortController.signal,
            headers: options.headers,
            auth: options.authorization
        } as AxiosRequestConfig).pipe());
    }
}