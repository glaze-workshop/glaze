import { CommonTimestamp } from './time'

/**
 * 团队类型
 */
export enum GlazeDeploymentStatusEnum {
  /** 执行中 */
  RUNNING='RUNNING',
  /** 暂停 */
  SUSPEND='SUSPEND'
}
export type GlazeDeploymentStatus = `${GlazeDeploymentStatusEnum}`

export interface DeploymentEntity extends CommonTimestamp {
  id: number

  projectId: number
  /**
   * 部署路径
   */
  path: string

  status: GlazeDeploymentStatus

  screenshot?: string | null
}
