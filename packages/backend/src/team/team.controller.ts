/*
https://docs.nestjs.com/controllers#controllers
*/

import { Entity, TeamApi, TeamDto } from '@glaze/common'
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../auth/jwt.guard'
import { CurrentUser } from '../auth/user.decorator'
import { TeamService } from './team.service'

@Controller()
export class TeamController {
  constructor (private teamService: TeamService) {}

  /**
   * 创建团队
   */
  @UseGuards(JwtGuard)
  @Post(TeamApi.FULL_TEAM_PATH)
  createTeam (@CurrentUser() user: Entity.UserEntity, @Body() teamCreationDTO: TeamDto.TeamCreationDTO) {
    return this.teamService.createTeam(user.id, teamCreationDTO.name)
  }

  /**
   * 获得用户加入的所有团队
   * @param userId 用户 id
   */
  @Get(TeamApi.FULL_TEAM_PATH)
  getTeams (@Query('userId', new ParseIntPipe()) userId: number) {
    return this.teamService.getTeams(userId)
  }

  /**
   * 修改团队
   */
  @Put(TeamApi.FULL_TEAM_PATH_WITH_ID)
  updateTeam (@Param('id', new ParseIntPipe()) id: number, @Body() teamUpdateDTO: TeamDto.TeamUpdateDTO) {
    return this.teamService.updateTeam(id, teamUpdateDTO)
  }

  @Get(TeamApi.FULL_TEAM_PATH_WITH_ID)
  getTeam (@Param('id', new ParseIntPipe()) id: number) {
    return this.teamService.getTeam(id)
  }

  /**
   * 删除团队
   */
  @Delete(TeamApi.FULL_TEAM_PATH_WITH_ID)
  deleteTeam (@Param('id', new ParseIntPipe()) id: number) {
    return this.teamService.deleteTeam(id)
  }

  /**
   * 加入团队
   */
  @Post(TeamApi.FULL_TEAM_MEMBER_PATH)
  joinTeam (@Param('id', new ParseIntPipe()) id: number, @Param('memberId', new ParseIntPipe()) memberId: number) {
    return this.teamService.joinTeam(id, memberId)
  }

  /**
   * 更新团队成员身份
   */
  @Put(TeamApi.FULL_TEAM_MEMBER_PATH)
  updateTeamMemberRole (@Param('id', new ParseIntPipe()) id: number, @Param('memberId', new ParseIntPipe()) memberId: number, @Body() role: Entity.GlazeTeamRoleEnum) {
    return this.teamService.updateTeamMemberRole(id, memberId, role)
  }

  /**
   * 删除成员
   */
  @Delete(TeamApi.FULL_TEAM_MEMBER_PATH)
  deleteTeamMember (@Param('id', new ParseIntPipe()) id: number, @Param('memberId', new ParseIntPipe()) memberId: number) {
    return this.teamService.deleteTeamMember(id, memberId)
  }
}
