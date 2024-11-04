import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request: FastifyRequest = context.getRequest<FastifyRequest>();
    const response: FastifyReply = context.getResponse<FastifyReply>();
    const errorResponse = exception.getResponse();

    let traceId = request.body
      ? request.body['traceId']
        ? request.body['traceId']
        : 'unknown'
      : 'unknown';

    response.statusCode = exception.getStatus();
    let payload: any = {
      statusCode: response.statusCode,
      traceId: traceId,
    };
    if (typeof errorResponse === 'string') {
      payload.message = errorResponse;
    } else {
      payload = {
        ...errorResponse,
        ...payload,
      };
    }

    response.send({
      success: false,
      data: payload,
    });
  }
}
