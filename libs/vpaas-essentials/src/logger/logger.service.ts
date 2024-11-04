import { ecsFormat } from '@elastic/ecs-winston-format';
import { Injectable, LoggerService as LoggerInterface } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, Logger, transports } from 'winston';
import 'colors';

@Injectable()
export class LoggerService implements LoggerInterface {
  static levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
    verbose: 5,
  };
  static colors = {
    fatal: 'inverse red',
    error: 'bold red',
    warning: 'italic yellow',
    info: 'underline cyan',
    debug: 'inverse green',
    verbose: 'dim magenta',
  };
  context = 'Unknown';
  private readonly logger: Logger;

  constructor(private readonly config: ConfigService) {
    this.logger = LoggerService.createLogger(this.config.get('logger.files'));
  }

  static createLogger(filenames: any): Logger {
    const cliFormatter = () => {
      return format.printf(
        ({ level, message, label, timestamp, context, error, state }) => {
          let errorMeta = '{}';
          if (error) {
            errorMeta = error ? JSON.stringify(error, null, 2) : '{}';
            errorMeta =
              errorMeta === '{}' && !error.stack ? error.toString() : '{}';
          }
          return (
            `${timestamp.yellow} [${context.green}${label ? `-${label}`.dim.green : ''}] ${level}: ${message} ` +
            `${state ? '\n' + JSON.stringify(state, null, 2).cyan : ''} ` +
            `${error ? (error.stack ? '\n' + error.stack.red : '') + (errorMeta !== '{}' ? '\n' + errorMeta.red : '') : ''}`
          );
        },
      );
    };

    return createLogger({
      levels: LoggerService.levels,
      transports: [
        new transports.Console({
          level: 'verbose',
          format: format.combine(
            format.errors({ stack: true }),
            format.timestamp({
              format: 'DD-MM-YYYY HH:mm:ss.SSS',
            }),
            format.colorize({
              colors: LoggerService.colors,
            }),
            cliFormatter(),
          ),
        }),
        new transports.File({
          level: 'error',
          format: ecsFormat(),
          filename: filenames.error,
        }),
      ],
    });
  }

  debug(
    message: string,
    context: string = this.context,
    label?: string,
    state?: object,
  ): any {
    this.logger.debug(message, { label, context, state });
  }

  error(
    message: string,
    error?: Error,
    context: string = this.context,
    label?: string,
    state?: object,
  ): any {
    this.logger.error(message, { label, error, context, state });
  }

  fatal(
    message: string,
    error?: Error,
    context: string = this.context,
    label?: string,
    state?: object,
  ): any {
    this.logger.log('fatal', message, { label, error, context, state });
  }

  verbose(
    message: string,
    context: string = this.context,
    label?: string,
    state?: object,
  ): any {
    this.logger.verbose(message, { label, context, state });
  }

  warn(
    message: string,
    context: string = this.context,
    label?: string,
    state?: object,
  ): any {
    this.logger.warn(message, { label, context, state });
  }

  log(
    message: string,
    context: string = this.context,
    label?: string,
    state?: object,
  ): any {
    this.logger.log('info', message, { context, label, state });
  }
}
