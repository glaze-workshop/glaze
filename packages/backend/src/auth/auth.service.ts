/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { AuthDto, GlazeErr } from '@glaze/common'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor (private userService: UserService) {}

  /**
   * 登录
   *
   * @param loginInfo 登录信息
   * @returns token 数据
   */
  async login (loginInfo: AuthDto.AuthLoginDTO) {
    const userInfo = await this.userService.findUserByUsername(loginInfo.username)
    if (
      loginInfo.password &&
      userInfo?.password &&
      await bcrypt.compare(loginInfo?.password, userInfo.password)
    ) {
      return userInfo
    }
    throw new GlazeErr.LoginFailedError()
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
}
