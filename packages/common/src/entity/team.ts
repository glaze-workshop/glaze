import { CommonTimestamp } from './time'

/**
 * 团队类型
 */
export enum GlazeTeamTypeEnum {
  /** 草稿团队（个人默认创建） */
  DRAFT = 'DRAFT',
  /** 公开团队 */
  PUBLIC = 'PUBLIC',
  /** 私有团队 */
  PRIVATE = 'PRIVATE'
};
export type GlazeTeamType = `${GlazeTeamTypeEnum}`
/**
 * 团队实体
 */
export interface TeamEntity extends CommonTimestamp {
  id: number
  /**
   * 团队名称
   */
  name: string
  /**
   * 介绍
   */
  intro?: string | null
  /**
   * 团队logo
   */
  logo?: string | null

  /**
   * 团队类型
   */
  type: GlazeTeamType
}

/**
 * 团队身份
 */
export enum GlazeTeamRoleEnum {
  /** 管理员 */
  ADMIN = 'ADMIN',
  /** 普通成员 */
  MEMBER = 'MEMBER',
  /** 仅阅读 */
  VIEWER = 'VIEWER',
}
export type GlazeTeamRole = `${GlazeTeamRoleEnum}`

export interface TeamMemberEntity {
  id: number
  memberId: number
  teamId: number
  role: GlazeTeamRole
}
