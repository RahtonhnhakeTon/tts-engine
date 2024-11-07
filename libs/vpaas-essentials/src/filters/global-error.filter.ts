import { LoggerService } from '@app/vpaas-essentials/logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch(Error)
export class GlobalErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(error: Error, host: ArgumentsHost) {
    if (error instanceof HttpException) {
      throw error;
    }
    const context = host.switchToHttp();
    const request: FastifyRequest = context.getRequest<FastifyRequest>();
    const response: FastifyReply = context.getResponse<FastifyReply>();

    let traceId = request.body
      ? request.body['traceId']
        ? request.body['traceId']
        : 'unknown'
      : 'unknown';

    this.logger.error(
      `Uncaught exception on API: ${request.url}`,
      error,
      GlobalErrorFilter.name,
      'catch',
    );

    response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    let payload: any = {
      message: 'Some error occurred, please try again later.',
      statusCode: response.statusCode,
      traceId: traceId,
    };

    response.send({
      success: false,
      data: payload,
    });
  }
}
