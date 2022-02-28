/*
https://docs.nestjs.com/providers#services
*/

import { Entity, AuthDto, GlazeErr } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../global/prisma.service'
import { TeamService } from '../team/team.service'
import { isUniqueConstraintError } from '../utils/prisma.error'

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService, private teamService: TeamService) {}

  /**
   * 创建用户
   *
   * @param user 用户信息
   * @returns 新建的用户
   * @throws {@link GlazeErr.UsernameDuplicationError}
   */
  async addUser (user: Prisma.GlazeUserCreateInput, showPassword = false): Promise<Entity.UserEntity> {
    try {
      const newUser = await this.prisma.glazeUser.create({
        data: {
          inTeams: {
            create: {
              role: Entity.GlazeTeamRoleEnum.ADMIN,
              team: {
                create: {
                  type: Entity.GlazeTeamTypeEnum.DRAFT,
                  name: user.username,
                  projectFolders: {
                    create: this.teamService.defaultFolderList
                  }
                }
              }
            }
          },
          ...user
        }
      })

      if (!showPassword && newUser) {
        return this.cleanPassword(newUser)
      }
      return newUser
    } catch (e) {
      if (isUniqueConstraintError<AuthDto.AuthRegisterDTO>(e)) {
        if (e.meta.target.includes('username')) {
          throw new GlazeErr.UsernameDuplicationError(user.username)
        }
        // TODO: Add phone in register
        // if (e.meta.target.includes('phone') && user.phone) {
        //   throw new GlazeErr.PhoneDuplicationError(user.phone)
        // }
      }
      throw e
    }
  }

  /**
   * 通过用户名查找用户
   *
   * @param username 用户名
   * @param showPassword 展示密码
   * @returns 用户信息
   */
  async findUserByUsername (username: string, showPassword = false): Promise<Entity.UserEntity | null> {
    const user = await this.prisma.glazeUser.findFirst({
      where: {
        username
      }
    })
    if (!showPassword && user) {
      return this.cleanPassword(user)
    }
    return user
  }

  async findUserById (id: number, showPassword = false): Promise<Entity.UserEntity | null> {
    const user = await this.prisma.glazeUser.findFirst({
      where: {
        id
      }
    })
    if (!showPassword && user) {
      return this.cleanPassword(user)
    }
    return user
  }

  private cleanPassword (user: Entity.UserEntity): Entity.UserEntity {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
