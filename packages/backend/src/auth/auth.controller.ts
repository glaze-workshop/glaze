/*
https://docs.nestjs.com/controllers#controllers
*/

import { AuthApi, AuthDto, Prefix } from '@glaze/common'
import { Body, Controller, Post } from '@nestjs/common'
import { YupPipe } from '../yup.pipe'
import { AuthService } from './auth.service'

/**
 * 权限与用户接口
 */
@Controller(Prefix.AuthPrefix)
export class AuthController {
  constructor (private authService: AuthService) {}

  /**
   * 登录
   *
   * @param loginDTO 登录信息
   * @returns 登录行为最重要的是提供 jwt 的 cookie
   */
  @Post(AuthApi.AUTH_LOGIN_PATH)
  login (@Body(new YupPipe(AuthDto.AuthLoginSchema)) loginDTO: AuthDto.AuthLoginDTO) {
    return this.authService.login(loginDTO)
  }

  /**
   * 注册
   *
   * @param registerDTO 注册信息
   * @returns 注册是创建用户的行为
   */
  @Post(AuthApi.AUTH_REGISTER_PATH)
  register (@Body() registerDTO: AuthDto.AuthRegisterDTO) {
    return this.authService.registerUser(registerDTO)
  }
}
