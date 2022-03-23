/*
https://docs.nestjs.com/providers#services
*/

import { Entity, notEmpty, PluginDto } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { GlazePluginType, Prisma } from '@prisma/client'
import { PrismaService } from '../global/prisma.service'
import { isUniqueConstraintError } from '../utils/prisma.error'

@Injectable()
export class PluginService {
  constructor(private prisma: PrismaService) {}

  createOrUpdatePlugin(
    user: Entity.UserEntity,
    pluginDto: PluginDto.GlazePluginDto
  ) {
    return this.prisma.glazePlugin.upsert({
      where: {
        id: pluginDto.id
      },
      update: {
        name: pluginDto.name,
        desc: pluginDto.desc,
        path: pluginDto.path,
        icon: pluginDto.icon,
        type: pluginDto.type,
        configSchema: pluginDto.configSchema as any,
        ownerTeamId: pluginDto.ownerTeamId,
        lastUpdateByUserId: user.id
      },
      create: {
        id: pluginDto.id,
        name: pluginDto.name,
        desc: pluginDto.desc,
        path: pluginDto.path,
        icon: pluginDto.icon,
        type: pluginDto.type,
        configSchema: pluginDto.configSchema as any,
        ownerTeamId: pluginDto.ownerTeamId,
        lastUpdateByUserId: user.id
      }
    })
  }

  usePlugin(
    projectId: number,
    pluginId: string,
    config: Prisma.InputJsonObject
  ) {
    return this.prisma.glazeProjectUsedPlugin.upsert({
      where: {
        projectId,
        pluginId
      },
      create: {
        projectId,
        pluginId,
        config
      },
      update: {
        config
      }
    })
  }

  getPublicPlugins(pluginId: string) {
    return this.prisma.glazePlugin.findMany({
      where: {
        id: pluginId,
        type: GlazePluginType.PUBLIC
      }
    })
  }

  getPluginById(pluginId: string) {
    return this.prisma.glazePlugin.findFirst({
      where: {
        id: pluginId
      }
    })
  }

  getPlugins(teamId?: number) {
    const isInTeam = notEmpty(teamId)
    return this.prisma.glazePlugin.findMany({
      where: {
        ownerTeamId: teamId,
        type: isInTeam ? undefined : GlazePluginType.PUBLIC
      },
      include: {
        lastUpdateBy: isInTeam
          ? {
              select: {
                id: true,
                username: true,
                phone: true,
                avatar: true,
                nickname: true
              }
            }
          : false
      }
    })
  }

  getProjectUsedPlugins(projectId: number) {
    return this.prisma.glazePlugin.findMany({
      where: {
        usedProjects: {
          some: {
            projectId
          }
        }
      }
    })
  }

  getProjectUsedPlugin(projectId: number, pluginId: string) {
    return this.prisma.glazeProjectUsedPlugin.findFirst({
      where: {
        projectId,
        pluginId
      }
    })
  }

  deleteProjectPlugin(projectId: number, pluginId: string) {
    return this.prisma.glazeProjectUsedPlugin.delete({
      where: {
        projectId,
        pluginId
      }
    })
  }
}
