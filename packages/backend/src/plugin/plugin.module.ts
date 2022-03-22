import { PluginService } from './plugin.service'
import { PluginController } from './plugin.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { TeamModule } from '../team/team.module'

@Module({
  imports: [
    TeamModule
  ],
  controllers: [
    PluginController],
  providers: [
    PluginService]
})
export class PluginModule {}
