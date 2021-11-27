import { ValidationError } from 'yup'
import { ErrorCode } from './error.code'
import { t } from 'i18next'
/**
 * 错误体
 */
export interface ErrorInfo {
  /**
   * 错误体的
   */
  error: true

  /**
   * 状态码
   */
  status: ErrorCode

  /**
   * 消息
   */
  message: string
}

/**
 * 抽象
 */
export abstract class AbstractError<T extends ErrorCode = ErrorCode> extends Error implements ErrorInfo {
  error: true = true
  status: T
  constructor (message: string, status: T, name?: string, stack?: string) {
    super(message)
    this.status = status
    if (name) {
      this.name = name
    }
    this.stack = stack
  }
}

/**
 * 服务器异常
 */
export class ServerError extends AbstractError<ErrorCode.ServerError> {
  constructor (error: Error) {
    super(error.message, ErrorCode.ServerError, error.name, error.stack)
  }
}

/**
 * 用户输入验证失败
 */
export class GlazeValidationError extends AbstractError<ErrorCode.ValidationError> {
  /**
   * 验证的失败信息
   */
  validation: ValidationError
  constructor (validationError: ValidationError) {
    super(validationError.message, ErrorCode.ValidationError)
    this.validation = validationError
  }
}
