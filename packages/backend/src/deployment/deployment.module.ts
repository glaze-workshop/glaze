import { DeploymentService } from './deployment.service'
import { DeploymentController } from './deployment.controller'
/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common'
import { DocModule } from '../doc/doc.module'
import { ScreenshotModule } from '../screenshot/screenshot.module'
import { PluginModule } from '../plugin/plugin.module'
import { ComponentModule } from '../component/component.module'

@Module({
  imports: [
    PluginModule,
    ComponentModule,
    DocModule,
    forwardRef(() => ScreenshotModule)
  ],
  controllers: [DeploymentController],
  providers: [DeploymentService],
  exports: [DeploymentService]
})
export class DeploymentModule {}
