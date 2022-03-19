import { ScreenshotService } from './screenshot.service'
/*
https://docs.nestjs.com/modules
*/

import { BullModule } from '@nestjs/bull'
import { forwardRef, Module } from '@nestjs/common'
import { PuppeteerService } from './puppeteer.service'
import { DocModule } from '../doc/doc.module'
import { DeploymentModule } from '../deployment/deployment.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'screenshot'
    }),
    forwardRef(() => DocModule),
    forwardRef(() => DeploymentModule)
  ],
  controllers: [],
  providers: [
    ScreenshotService,
    PuppeteerService],
  exports: [ScreenshotService]
})
export class ScreenshotModule {}
