import { ecsFormat } from '@elastic/ecs-winston-format';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor(private readonly config: ConfigService) {
    this.logger = this.createLogger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: FastifyRequest = context
      .switchToHttp()
      .getRequest<FastifyRequest>();
    const { method, url, ip, body, hostname, headers } = request;
    const arrivalTime = new Date();

    return next.handle().pipe(
      tap((payload) => {
        const response = context.switchToHttp().getResponse<FastifyReply>();

        this.logger.log('api', '', {
          'meta.method': method,
          'meta.path': url,
          'meta.domain': hostname,
          'meta.response-time': Date.now() - arrivalTime.valueOf() + 'ms',
          'request.from': ip,
          'request.headers': headers,
          'request.body': body,
          'response.status': response.statusCode,
          'response.headers': response.getHeaders(),
          'response.body': payload,
        });
      }),
    );
  }

  private createLogger() {
    const formatter = format((info) => {
      delete info.level;
      delete info.message;
      return info;
    });

    return createLogger({
      levels: { api: 1 },
      format: format.combine(formatter(), ecsFormat()),
      transports: [
        new transports.File({
          level: 'api',
          filename: this.config.get<string>('logger.files.api'),
        }),
      ],
    });
  }
}
