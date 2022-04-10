export interface BasicDeploymentAnalysis {
  totalSize: number
  /** 请求数 */
  count: number
}

export interface EachDayDeploymentAnalysis extends Record<string, any> {
  day: string
  requestCount: number
  userCount: number
  size: number
}

export interface FullDeploymentAnalysis {
  totalSize: number

  count: number

  eachDay: EachDayDeploymentAnalysis[]
}

export interface DeploymentClickEventDto {
  id: string
  deploymentId: number
  nodeId: string

  /** 时间戳 */
  time: number
  path: string
  position: any
}

export interface DeploymentClickEventQueryDto {
  range: number[]
}
