import { t } from 'i18next'
import { string, object, SchemaOf, ref } from 'yup'
import { UserEntity } from '../entity'

import { CriticalStringRegex } from '../utils/regex'

/**
 * 登录 dto
 */
export class AuthLoginDTO {
  /**
   * 用户名
   */
  username: string

  /**
   * 密码
   */
  password: string
}

/**
 * 登录校验
 */
export const AuthLoginSchema: SchemaOf<AuthLoginDTO> = object({
  username: string().matches(CriticalStringRegex, () => t('dto.auth.username')).required(),
  password: string().matches(CriticalStringRegex, () => t('dto.auth.password')).required()
})

/**
 * 注册
 */
export class AuthRegisterDTO {
  /**
   * 用户名
   */
  username: string

  /**
   * 密码
   */
  password: string

  /**
   * 再次输入密码
   */
  passwordAgain: string
}

/**
 * 注册校验
 */
export const AuthRegisterSchema: SchemaOf<AuthRegisterDTO> = object({
  username: string().matches(CriticalStringRegex, () => t('dto.auth.username')).required(),
  password: string().matches(CriticalStringRegex, () => t('dto.auth.password')).required(),
  passwordAgain: string().oneOf([ref('password'), null], () => t('dto.auth.password_again.same')).required()
})

export interface UserInfoWithToken extends UserEntity {
  token: string
}
