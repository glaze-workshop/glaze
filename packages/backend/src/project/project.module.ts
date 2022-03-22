import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { DocModule } from '../doc/doc.module'
import { PluginModule } from '../plugin/plugin.module'

@Module({
  imports: [
    DocModule,
    PluginModule
  ],
  controllers: [
    ProjectController],
  providers: [
    ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
