import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import {  Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message: exceptionResponse.message || exception.message,
      ...(exceptionResponse.error && { error: exceptionResponse.error }),
    });
  }
}
