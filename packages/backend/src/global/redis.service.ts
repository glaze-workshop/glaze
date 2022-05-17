/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { RedisOptions } from 'ioredis'

@Injectable()
export class RedisService {
  readonly redis: Redis.Redis
  readonly host: string
  readonly port: number
  readonly keyPrefix: string
  readonly pub: Redis.Redis
  readonly sub: Redis.Redis

  constructor(private readonly configService: ConfigService) {
    this.host = this.configService.get('REDIS_HOST')!
    this.port = Number(this.configService.get('REDIS_PORT')!)
    this.keyPrefix = configService.get('REDIS_PREFIX')!

    const redisConfig: RedisOptions = {
      host: this.host,
      port: this.port,
      keyPrefix: this.keyPrefix
    }
    this.redis = new Redis(redisConfig)
    this.pub = new Redis(redisConfig)
    this.sub = new Redis(redisConfig)
  }
}
