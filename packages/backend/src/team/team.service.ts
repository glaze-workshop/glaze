/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { Entity, TeamDto } from '@glaze/common'
import { PrismaService } from '../global/prisma.service'

@Injectable()
export class TeamService {
  constructor (private prisma: PrismaService) {}

  createTeam (name: string, type = Entity.GlazeTeamTypeEnum.PRIVATE): Promise<Entity.TeamEntity> {
    return this.prisma.glazeTeam.create({
      data: {
        type,
        name
      }
    })
  }

  getTeams (memberId: number): Promise<Entity.TeamEntity[]> {
    return this.prisma.glazeTeam.findMany({
      where: {
        members: {
          some: {
            memberId: { equals: memberId }
          }
        }
      }
    })
  }

  updateTeam (teamId: number, teamUpdateDTO: TeamDto.TeamUpdateDTO): Promise<Entity.TeamEntity> {
    return this.prisma.glazeTeam.update({
      where: {
        id: teamId
      },
      data: teamUpdateDTO
    })
  }

  deleteTeam (teamId: number): Promise<Entity.TeamEntity> {
    return this.prisma.glazeTeam.delete({
      where: {
        id: teamId
      }
    })
  }

  joinTeam (teamId: number, memberId: number) {
    return this.prisma.glazeTeamMember.create({
      data: {
        teamId,
        memberId,
        role: Entity.GlazeTeamRoleEnum.MEMBER
      }
    })
  }

  updateTeamMemberRole (teamId: number, memberId: number, role: Entity.GlazeTeamRoleEnum) {
    return this.prisma.glazeTeamMember.update({
      where: {
        memberId_teamId: {
          teamId,
          memberId
        }
      },
      data: {
        role
      }
    })
  }

  deleteTeamMember (teamId: number, memberId: number) {
    return this.prisma.glazeTeamMember.delete({
      where: {
        memberId_teamId: {
          teamId,
          memberId
        }
      }
    })
  }
}
