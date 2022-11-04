/*
https://docs.nestjs.com/providers#services
*/

import { Entity, ComponentDto } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { GlazePluginType } from '@prisma/client'
import { ProjectService } from '../project/project.service'

@Injectable()
export class ComponentService {
  constructor(
    private prisma: PrismaService,
    private readonly projectService: ProjectService
  ) {}

  createOrUpdateComponent(
    user: Entity.UserEntity,
    componentDto: ComponentDto.GlazeComponentDto
  ) {
    return this.prisma.glazeComponent.upsert({
      where: {
        id: componentDto.id
      },
      update: {
        name: componentDto.name,
        desc: componentDto.desc,
        path: componentDto.path,
        icon: componentDto.icon,
        type: componentDto.type,
        props: componentDto.props as any,
        defaultSize: componentDto.defaultSize as any,
        ownerTeamId: componentDto.ownerTeamId,
        hasChildren: componentDto.hasChildren ?? false,
        lastUpdateByUserId: user.id
      },
      create: {
        id: componentDto.id,
        name: componentDto.name,
        desc: componentDto.desc,
        path: componentDto.path,
        icon: componentDto.icon,
        type: componentDto.type,
        props: componentDto.props as any,
        defaultSize: componentDto.defaultSize as any,
        ownerTeamId: componentDto.ownerTeamId,
        hasChildren: componentDto.hasChildren ?? false,
        lastUpdateByUserId: user.id
      }
    })
  }

  getComponentsByOwner(teamId: number) {
    return this.prisma.glazeComponent.findMany({
      where: {
        ownerTeamId: teamId
      },
      include: {
        lastUpdateBy: {
          select: {
            id: true,
            username: true,
            phone: true,
            avatar: true,
            nickname: true
          }
        }
      }
    })
  }

  async getComponentsByProjectId(projectId: number) {
    const project = await this.projectService.getProject(Number(projectId))
    if (project?.projectFolder) {
      return this.getComponentsByTeam(project.projectFolder.teamId)
    }
    return []
  }

  getComponentsByTeam(teamId: number) {
    return this.prisma.glazeComponent.findMany({
      where: {
        OR: [
          {
            ownerTeamId: teamId
          },
          {
            type: GlazePluginType.PUBLIC
          }
        ]
      },
      include: {
        lastUpdateBy: {
          select: {
            id: true,
            username: true,
            phone: true,
            avatar: true,
            nickname: true
          }
        }
      }
    })
  }
}
