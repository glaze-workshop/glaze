import { AbstractError } from './basic'
import { ErrorCode } from './error.code'
import { t } from 'i18next'

/**
 * 用户名已被使用报错
 */
export class UsernameDuplicationError extends AbstractError<ErrorCode.UsernameDuplicationError> {
  constructor(username: string) {
    super(
      t('error.username.duplication', { username }),
      ErrorCode.UsernameDuplicationError
    )
  }
}

/**
 *
 * 手机号重复报错
 */
export class PhoneDuplicationError extends AbstractError<ErrorCode.PhoneDuplicationError> {
  constructor(phone: string) {
    super(
      t('error.phone.duplication', { phone }),
      ErrorCode.PhoneDuplicationError
    )
  }
}

export class LoginFailedError extends AbstractError<ErrorCode.LoginFailedError> {
  constructor() {
    super(t('error.login'), ErrorCode.LoginFailedError)
  }
}

export class JwtAuthError extends AbstractError<ErrorCode.JwtAuthError> {
  constructor() {
    super(t('error.jwt'), ErrorCode.JwtAuthError)
  }
}

export class DeploymentPathDuplicationError extends AbstractError<ErrorCode.DeploymentPathDuplicationError> {
  constructor(path: string) {
    super(`部署路径「${path}」重复`, ErrorCode.DeploymentPathDuplicationError)
  }
}

export class PluginIdDuplicationError extends AbstractError<ErrorCode.PluginIdDuplicationError> {
  constructor(id: string) {
    super(`插件ID「${id}」重复`, ErrorCode.PluginIdDuplicationError)
  }
}

export class PermissionDeniedError extends AbstractError<ErrorCode.PermissionDeniedError> {
  constructor(message?: string) {
    super(message ?? '用户权限不足', ErrorCode.PermissionDeniedError)
  }
}
