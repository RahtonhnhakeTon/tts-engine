import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { workspace as WorkspaceApiReference } from "./api-reference.json"
import {Client} from "@app/tts-vendors/commons/client";
import {l2i_GenerateTtsDto} from "@app/tts-vendors/listen2it/workspace.dto";

@Injectable()
export class WorkspaceService extends Client{
    private _workspace_id: string = null;
    private _base_url: string;

    constructor(private readonly httpClient: HttpService,
                private readonly config: ConfigService) {
        super(HttpService);
        this._base_url = config.get<string>('listen2it.baseURL.main') || config.get<string>('listen2it.baseURL.sandbox');
    }

    set workspaceID(value: string) {
        this._workspace_id = value;
    }

    _send(pathname: string, options: any) {
        options.headers
    }

    generateTTS(body: l2i_GenerateTtsDto) {



    }


}
