import { DocController } from './doc.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { DocService } from './doc.service'
import { DocGateway } from './doc.gateway'

@Module({
  imports: [],
  controllers: [DocController],
  providers: [DocService, DocGateway],
  exports: [DocService]
})
export class DocModule {}
