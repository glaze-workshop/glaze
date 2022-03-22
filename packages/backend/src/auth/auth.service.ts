/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { AuthDto, Entity, GlazeErr, notEmpty } from '@glaze/common'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as _ from 'lodash'

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService) {}

  /**
   * 登录
   *
   * @param loginInfo 登录信息
   * @returns token 数据
   */
  async login (loginInfo: AuthDto.AuthLoginDTO): Promise<AuthDto.UserInfoWithToken> {
    const userInfo = await this.userService.findUserByUsername(loginInfo.username, true)
    if (
      loginInfo.password &&
      userInfo?.password &&
      await bcrypt.compare(loginInfo?.password, userInfo.password)
    ) {
      const token = this.generateJwtToken(userInfo)
      const { password, ...userInfoWithoutPassword } = userInfo
      return { ...userInfoWithoutPassword, token }
    }
    throw new GlazeErr.LoginFailedError()
  }

  /**
   * 生成 JWT token
   * @param user 用户信息
   * @returns jwt token
   */
  generateJwtToken (user: Entity.UserEntity) {
    const payload: Entity.JwtPayload = { sub: user.id, username: user.username }
    return this.jwtService.sign(payload)
  }

  /**
   * 用户注册
   *
   * @param user 注册信息
   * @returns 新建的用户
   * @throws {@link GlazeErr.UsernameDuplicationError}
   */
  async registerUser (user: AuthDto.AuthRegisterDTO) {
    user.password = await bcrypt.hash(user.password, Number(process.env.SALT_ROUND ?? 10))
    return this.userService.addUser({ username: user.username, password: user.password })
  }

  async verifyToken (token?: string) {
    if (notEmpty(token)) {
      const payload = this.jwtService.verify(token)
      if (!payload) {
        throw new GlazeErr.JwtAuthError()
      }
      const user = await this.userService.findUserById(payload.sub)
      if (!user) {
        throw new GlazeErr.JwtAuthError()
      }
      return user
    }
    throw new GlazeErr.JwtAuthError()
  }
}
