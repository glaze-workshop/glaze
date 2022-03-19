/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common'
import { CosService } from './cos.service'
import { PrismaService } from './prisma.service'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [PrismaService, CosService],
  exports: [PrismaService, CosService]
})
export class GlobalModule {}
