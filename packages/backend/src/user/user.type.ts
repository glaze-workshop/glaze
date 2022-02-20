import { Entity } from '@glaze/common'

/**
 * 用户名和密码
 */
export type UsernameAndPassword = Pick<Entity.UserEntity, 'username' | 'password'>
