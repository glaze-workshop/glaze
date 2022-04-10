import { DocController } from './doc.controller'
/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common'
import { DocService } from './doc.service'
import { DocGateway } from './doc.gateway'
import { AuthModule } from '../auth/auth.module'
import { ScreenshotModule } from '../screenshot/screenshot.module'

@Module({
  imports: [AuthModule, forwardRef(() => ScreenshotModule)],
  controllers: [DocController],
  providers: [DocService, DocGateway],
  exports: [DocService]
})
export class DocModule {}
