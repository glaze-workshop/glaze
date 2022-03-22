/*
https://docs.nestjs.com/providers#services
*/

import { Entity, PluginDto } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../global/prisma.service'
import { isUniqueConstraintError } from '../utils/prisma.error'

@Injectable()
export class PluginService {
  constructor (private prisma: PrismaService) {}

  async createOrUpdatePlugin (user: Entity.UserEntity, pluginDto: PluginDto.GlazePluginDto) {
    // 总是先尝试创建
    try {
      return await this.prisma.glazePlugin.create({
        data: {
          id: pluginDto.id,
          name: pluginDto.name,
          desc: pluginDto.desc,
          path: pluginDto.path,
          icon: pluginDto.icon,
          type: pluginDto.type,
          ownerTeamId: pluginDto.ownerTeamId,
          lastUpdateByUserId: user.id
        }
      })
    } catch (e) {
      if (isUniqueConstraintError<PluginDto.GlazePluginDto>(e)) {
      // 如果因为id重复创建失败，则尝试更新
        return await this.prisma.glazePlugin.update({
          where: {
            id: pluginDto.id
          },
          data: {
            name: pluginDto.name,
            desc: pluginDto.desc,
            path: pluginDto.path,
            icon: pluginDto.icon,
            type: pluginDto.type,
            ownerTeamId: pluginDto.ownerTeamId,
            lastUpdateByUserId: user.id
          }
        })
      }
    }
  }
}
