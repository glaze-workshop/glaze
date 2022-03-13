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
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor (private readonly httpAdapterHost: HttpAdapterHost) {}

  catch (exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    if (exception instanceof GlazeErr.AbstractError) {
      httpAdapter.reply(response, serializeError(exception))
    } else if (!(exception instanceof HttpException) && exception instanceof Error) {
      httpAdapter.reply(response, serializeError(new GlazeErr.ServerError(exception)))
    } else {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR

      httpAdapter.reply(response, {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url
      }, status)
    }
  }
}
