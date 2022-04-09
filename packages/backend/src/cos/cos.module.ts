import { CosController } from './cos.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { CosService } from './cos.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  controllers: [CosController],
  providers: [CosService],
  exports: [CosService]
})
export class CosModule {}
