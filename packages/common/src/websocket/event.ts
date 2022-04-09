export enum EditorMessageEvent {
  /**
   * glaze 表单数据同步
   */
  SYNC = 0,

  /**
   * 用户消息同步
   */
  AWARENESS = 1,

  /**
   * 异常
   */
  ERROR = 2,

  /**
   * 消息
   */
  MESSAGE = 3,

  /**
   * 权限验证
   */
  AUTH = 4,

  /**
   * 权限验证成功
   */
  AUTH_SUCCESS = 5
}
