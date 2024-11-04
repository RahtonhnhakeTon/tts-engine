import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

if (!('toJSON' in Error.prototype))
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      var alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        if (key !== 'stack' && key !== 'message') {
          alt[key] = this[key];
        }
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
