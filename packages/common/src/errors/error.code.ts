/**
 * 异常代码
 */
export enum ErrorCode {
  /**
   * 默认异常代码
   */
  DefaultError,

  /**
   * 服务器异常
   */
  ServerError,

  /**
   * 用户输入不合法
   */
  ValidationError,

  /**
   * 用户名已被占用
   */
  UsernameDuplicationError,

  /**
   * 手机号已被占用
   */
  PhoneDuplicationError,

  /**
   * 登录失败，用户名或密码不匹配
   */
  LoginFailedError,

  /**
   * jwt 验证错误
   */
  JwtAuthError,

  /**
   * 部署 path 重复
   */
  DeploymentPathDuplicationError,

  /**
   * 插件 id 重复
   */
  PluginIdDuplicationError,

  /**
   * 权限不足
   */
  PermissionDeniedError
}
