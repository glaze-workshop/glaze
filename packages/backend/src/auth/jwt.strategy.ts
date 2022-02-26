/*
https://docs.nestjs.com/providers#services
*/

import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../user/user.service'
import { Entity, GlazeErr } from '@glaze/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    private configService: ConfigService,
    private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    })
  }

  async validate (payload: Entity.JwtPayload | null) {
    if (!payload) {
      throw new GlazeErr.JwtAuthError()
    }
    const user = await this.userService.findUserById(payload.sub)
    if (!user) {
      throw new GlazeErr.JwtAuthError()
    }
    return user
  }
}
