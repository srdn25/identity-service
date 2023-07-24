import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from './tools/errors/Validation.error';
import { CustomError } from './tools/errors/Custom.error';

@Catch()
export class GlobalHandleErrors extends BaseExceptionFilter {
  constructor(
    readonly httpAdapterHost: HttpAdapterHost,
    readonly logger: Logger,
  ) {
    super();
  }

  catch(exception: Error | ValidationError, host: ArgumentsHost) {
    const isCustom = exception instanceof CustomError;

    if (isCustom) {
      const serializedError = exception.serialize();
      this.logger.error(serializedError, exception.stack.slice(0, 300));
      const ctx = host.switchToHttp();

      return this.httpAdapterHost.httpAdapter.reply(
        ctx.getResponse(),
        serializedError,
        exception.status,
      );
    }

    this.logger.error(exception);
    super.catch(exception, host);
  }
}
