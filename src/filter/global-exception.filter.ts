import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(error.message, error.stack);

    if (error instanceof HttpException) {
      return response.status(error.getStatus()).json(error.getResponse());
    }

    if (error.code === 'NETWORK_ERROR') {
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'RPC node unavailable',
      });
    }

    if (error.code === 'CALL_EXCEPTION' || error.reason) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Smart contract revert',
        reason: error.reason ?? error.shortMessage,
      });
    }

    if (error.code === 'INSUFFICIENT_FUNDS') {
      return response.status(402).json({
        statusCode: 402,
        message: 'Insufficient funds for transaction gas',
      });
    }

    if (error.message?.includes('cannot estimate gas')) {
      return response.status(422).json({
        statusCode: 422,
        message: 'Gas estimation failed',
      });
    }

    if (
      error.message?.includes('not a contract') ||
      error.message?.includes('missing revert data') ||
      error.message?.includes('execution reverted with no data')
    ) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid contract or method does not exist',
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected internal error',
      error: error.message,
    });
  }
}
