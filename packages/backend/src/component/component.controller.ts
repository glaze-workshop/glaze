/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ComponentService } from './component.service'
import { TeamService } from '../team/team.service'
import { JwtGuard } from '../auth/jwt.guard'
import {
  Entity,
  GlazeErr,
  notEmpty,
  ComponentApi,
  ComponentDto,
  Prefix
} from '@glaze/common'
import { CurrentUser } from '../auth/user.decorator'

@Controller(Prefix.COMPONENT_PREFIX)
export class ComponentController {
  constructor(
    private readonly componentService: ComponentService,
    private readonly teamService: TeamService
  ) {}

  @UseGuards(JwtGuard)
  @Post(ComponentApi.COMPONENT_PATH)
  async createOrUpdateComponent(
    @CurrentUser() user: Entity.UserEntity,
    @Body() componentDto: ComponentDto.GlazeComponentDto
  ) {
    const userInTeam = await this.teamService.getTeamMember(
      componentDto.ownerTeamId,
      user.id
    )
    if (!userInTeam || userInTeam.role === 'VIEWER') {
      throw new GlazeErr.PermissionDeniedError('用户不属于该团队')
    }
    return this.componentService.createOrUpdateComponent(user, componentDto)
  }

  @UseGuards(JwtGuard)
  @Get(ComponentApi.COMPONENT_PATH)
  async getComponents(
    @Query('ownerTeamId') ownerTeamId?: string,
    @Query('projectId') projectId?: string
  ) {
    if (notEmpty(ownerTeamId)) {
      return this.componentService.getComponentsByOwner(Number(ownerTeamId))
    } else if (notEmpty(projectId)) {
      return this.componentService.getComponentsByProjectId(Number(projectId))
    }
  }
}
