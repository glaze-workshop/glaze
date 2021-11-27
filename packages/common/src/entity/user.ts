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
  password?: string | null

  /**
   * 手机号
   */
  phone?: string | null

  /**
   * 头像地址
   */
  avatar?: string | null

  /**
   * 昵称
   */
  nickname?: string | null

  /**
   * 自我介绍
   */
  intro?: string | null
}
