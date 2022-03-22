/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { RenderService } from './render.service'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, RenderService],
  exports: [PrismaService, RenderService]
})
export class GlobalModule {}
