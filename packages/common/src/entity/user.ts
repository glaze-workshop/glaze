import { CommonTimestamp } from './time'

/**
 * 用户实体
 */
export interface UserEntity extends CommonTimestamp {
  id: number

  /**
   * 用户名
   */
  username: string

  /**
   * 密码
   */
  password: string

  /**
   * 手机号
   */
  phone?: string

  /**
   * 头像地址
   */
  avatar?: string

  /**
   * 昵称
   */
  nickname?: string

  /**
   * 自我介绍
   */
  intro?: string
}
