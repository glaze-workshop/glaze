/*
https://docs.nestjs.com/exception-filters#exception-filters-1
*/

import { GlazeErr } from '@glaze/common'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { serializeError } from 'serialize-error'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch (exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    if (exception instanceof GlazeErr.AbstractError) {
      response.json(serializeError(exception))
    } else if (!(exception instanceof HttpException) && exception instanceof Error) {
      response.json(serializeError(new GlazeErr.ServerError(exception)))
    } else {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url
      })
    }
  }
}
