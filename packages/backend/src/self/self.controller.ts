/*
https://docs.nestjs.com/controllers#controllers
*/

import { Entity, Prefix, SelfApi } from '@glaze/common'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../auth/jwt.guard'
import { CurrentUser } from '../auth/user.decorator'
import { ProjectService } from '../project/project.service'
import { TeamService } from '../team/team.service'

@Controller(Prefix.SELF_PREFIX)
export class SelfController {
  constructor (
    private teamService: TeamService,
    private projectService: ProjectService) {}

  @UseGuards(JwtGuard)
  @Get(SelfApi.SELF_INFO_PATH)
  getSelfInfo (@CurrentUser() user: Entity.UserEntity) {
    return user
  }

  @UseGuards(JwtGuard)
  @Get(SelfApi.SELF_TEAMS_PATH)
  getSelfTeams (@CurrentUser() user: Entity.UserEntity) {
    return this.teamService.getTeams(user.id)
  }
}
