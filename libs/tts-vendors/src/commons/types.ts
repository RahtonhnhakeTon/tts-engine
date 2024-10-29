import { HTTPMethods } from 'fastify';
import { AxiosBasicCredentials, AxiosHeaders } from 'axios';

export class SendRequestOptions {
  method?: HTTPMethods;
  payload?: any;
  headers?: AxiosHeaders;
  authorization?: AxiosBasicCredentials;
}
