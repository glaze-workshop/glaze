/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { RedisService } from './redis.service'
import { RenderService } from './render.service'

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [PrismaService, RenderService, RedisService],
  exports: [PrismaService, RenderService, RedisService]
})
export class GlobalModule {}
