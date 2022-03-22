/*
https://docs.nestjs.com/controllers#controllers
*/

import { Entity, GlazeErr, PluginApi, PluginDto, Prefix } from '@glaze/common'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/user.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { PluginService } from './plugin.service'
import { TeamService } from '../team/team.service'

@Controller(Prefix.PLUGIN_PREFIX)
export class PluginController {
  constructor (
    private readonly pluginService: PluginService,
    private readonly teamService: TeamService) {}

  @UseGuards(JwtGuard)
  @Post(PluginApi.PLUGIN_PATH)
  async createOrUpdatePlugin (@CurrentUser() user: Entity.UserEntity, @Body() pluginDto: PluginDto.GlazePluginDto) {
    const userInTeam = await this.teamService.getTeamMember(pluginDto.ownerTeamId, user.id)
    if (!userInTeam || userInTeam.role === 'VIEWER') {
      throw new GlazeErr.PermissionDeniedError('用户不属于该团队')
    }
    return this.pluginService.createOrUpdatePlugin(user, pluginDto)
  }
}
