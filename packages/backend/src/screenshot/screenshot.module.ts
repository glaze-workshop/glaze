import { ScreenshotService } from './screenshot.service'
/*
https://docs.nestjs.com/modules
*/

import { BullModule } from '@nestjs/bull'
import { forwardRef, Module } from '@nestjs/common'
import { PuppeteerService } from './puppeteer.service'
import { DocModule } from '../doc/doc.module'
import { DeploymentModule } from '../deployment/deployment.module'
import { MessageModule } from '../message/message.module'
import { ScreenshotProcessor } from './screenshot.processor'
import { ConfigModule } from '@nestjs/config'
import { CosModule } from '../cos/cos.module'
import { ProjectModule } from '../project/project.module'

@Module({
  imports: [
    ConfigModule,
    CosModule,
    BullModule.registerQueue({
      name: 'screenshot'
    }),
    forwardRef(() => MessageModule),
    forwardRef(() => DocModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => DeploymentModule)
  ],
  controllers: [],
  providers: [ScreenshotService, PuppeteerService, ScreenshotProcessor],
  exports: [ScreenshotService]
})
export class ScreenshotModule {}
