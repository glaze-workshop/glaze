import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
/*
https://docs.nestjs.com/modules
*/

import { forwardRef, Module } from '@nestjs/common'
import { PluginModule } from '../plugin/plugin.module'

@Module({
  imports: [forwardRef(() => PluginModule)],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
