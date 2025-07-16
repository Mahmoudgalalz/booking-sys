import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorResponse: any;

    // Handle CustomHttpException responses properly to avoid nesting
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      // Check if the response is already formatted (has success property)
      if ('success' in exceptionResponse) {
        errorResponse = exceptionResponse;
      } else {
        errorResponse = {
          success: false,
          ...exceptionResponse,
        };
      }
    } else {
      errorResponse = {
        success: false,
        message: exceptionResponse,
      };
    }

    // Ensure status code is set in both response body and headers
    response.status(status).json(errorResponse);
  }
}
