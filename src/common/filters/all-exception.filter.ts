import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { AppError } from 'src/utils/appError';
import { QueryFailedError, EntityPropertyNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  constructor(
    // Inject HttpAdapter
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const err = exception;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (err.isOperational && err instanceof AppError) {
      message = err.message;
      httpStatus = err.statusCode;
    }
    else if (err instanceof HttpException) {
      httpStatus = err.getStatus();
      const res = err.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
    }
    else if (err instanceof QueryFailedError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = err.message;
    }
    else if (err instanceof AggregateError) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = err.message;
    }
    else if (err instanceof EntityPropertyNotFoundError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = err.message;
    }
    else if (err instanceof TokenExpiredError) {
      httpStatus = HttpStatus.UNAUTHORIZED;
      message = err.message;
    }
    else if (err instanceof JsonWebTokenError) {
      httpStatus = HttpStatus.UNAUTHORIZED;
      message = err.message;
    }
    else {
      this.logger.error(err);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: req.url,
      message
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}