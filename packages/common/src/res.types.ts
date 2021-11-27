import { ErrorInfo } from './errors/basic'

/**
 * 前端收到的返回值，如果返回值存在 error 变量并且值为 true 时，这是一条错误消息，
 * 铺平是为了控制返回体深度
 *
 * @example
 *
 * 异常时的返回值
 * ```json
 * {
 *   error: true,
 *   status: 0,
 *   message: "默认异常"
 * }
 * ```
 *
 * @example
 *
 * 正常时的返回值
 * ```json
 * {
 *   user: [{
 *     id: 1
 *     name: b
 *   }],
 *   page: 1
 * }
 * ```
 */
export type Response<T = unknown, E extends ErrorInfo = ErrorInfo> = T | E

/**
 * 检查服务器返回值是否是错误类型
 */
export function isResError<T = unknown, E extends ErrorInfo = ErrorInfo> (data: Response<T, E>): data is E {
  type HasErrorProperty = {error: boolean}

  return typeof data === 'object' &&
  Object.prototype.hasOwnProperty.call(data, 'error') &&
  (data as HasErrorProperty).error === true
}
