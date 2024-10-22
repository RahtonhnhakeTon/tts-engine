import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {lastValueFrom} from "rxjs";

@Injectable
export class Client {
    private readonly abortController = new AbortController();
    private _base_url: string;

    set base_url(value: string) {
        this._base_url = value;
    }

    constructor(private readonly httpClient: HttpService) {
    }

    _send(pathname: string, options: any) {
        const response = await lastValueFrom(this.httpClient.request({
            url: new URL(pathname, this._base_url),
        }).pipe());
    }
}