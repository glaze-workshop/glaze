import { TeamController } from './team.controller'
import { TeamService } from './team.service'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [
    TeamController],
  providers: [
    TeamService]
})
export class TeamModule {

}
