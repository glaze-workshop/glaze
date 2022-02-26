/*
https://docs.nestjs.com/controllers#controllers
*/

import { Entity, TeamApi, TeamDto } from '@glaze/common'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { TeamService } from './team.service'

@Controller()
export class TeamController {
  constructor (private teamService: TeamService) {}

  /**
   * 创建团队
   */
  @Post(TeamApi.FULL_TEAM_PATH)
  createTeam (@Body() teamCreationDTO: TeamDto.TeamCreationDTO) {
    return this.teamService.createTeam(teamCreationDTO.name)
  }

  /**
   * 获得用户加入的所有团队
   * @param userId 用户 id
   */
  @Get(TeamApi.FULL_TEAM_PATH)
  getTeams (@Query('userId') userId: number) {
    return this.teamService.getTeams(userId)
  }

  /**
   * 修改团队
   */
  @Put(TeamApi.FULL_TEAM_PATH_WITH_ID)
  updateTeam (@Param('id') id: number, @Body() teamUpdateDTO: TeamDto.TeamUpdateDTO) {
    return this.teamService.updateTeam(id, teamUpdateDTO)
  }

  /**
   * 删除团队
   */
  @Delete(TeamApi.FULL_TEAM_PATH_WITH_ID)
  deleteTeam (@Param('id') id: number) {
    return this.teamService.deleteTeam(id)
  }

  /**
   * 加入团队
   */
  @Post(TeamApi.FULL_TEAM_MEMBER_PATH)
  joinTeam (@Param('id') id: number, @Param('memberId') memberId: number) {
    return this.teamService.joinTeam(id, memberId)
  }

  /**
   * 更新团队成员身份
   */
  @Put(TeamApi.FULL_TEAM_MEMBER_PATH)
  updateTeamMemberRole (@Param('id') id: number, @Param('memberId') memberId: number, @Body() role: Entity.GlazeTeamRoleEnum) {
    return this.teamService.updateTeamMemberRole(id, memberId, role)
  }

  /**
   * 删除成员
   */
  @Delete(TeamApi.FULL_TEAM_MEMBER_PATH)
  deleteTeamMember (@Param('id') id: number, @Param('memberId') memberId: number) {
    return this.teamService.deleteTeamMember(id, memberId)
  }
}
