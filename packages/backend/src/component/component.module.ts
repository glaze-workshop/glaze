import { ComponentService } from './component.service'
import { ComponentController } from './component.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { TeamModule } from '../team/team.module'
import { ProjectModule } from '../project/project.module'

@Module({
  imports: [TeamModule, ProjectModule],
  controllers: [ComponentController],
  providers: [ComponentService],
  exports: [ComponentService]
})
export class ComponentModule {}
