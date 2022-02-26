/*
https://docs.nestjs.com/providers#services
*/

import { Entity, AuthDto, GlazeErr } from '@glaze/common'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../global/prisma.service'
import { isUniqueConstraintError } from '../utils/prisma.error'

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}

  /**
   * 创建用户
   *
   * @param user 用户信息
   * @returns 新建的用户
   * @throws {@link GlazeErr.UsernameDuplicationError}
   */
  async addUser (user: Prisma.GlazeUserCreateInput): Promise<Entity.UserEntity> {
    try {
      return await this.prisma.glazeUser.create({
        data: user
      })
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
      user.password = null
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
      user.password = null
    }
    return user
  }
}
