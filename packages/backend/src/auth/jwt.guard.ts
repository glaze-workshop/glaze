/*
https://docs.nestjs.com/guards#guards
*/

import { GlazeErr } from '@glaze/common'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest (err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new GlazeErr.JwtAuthError()
    }
    return user
  }
}
