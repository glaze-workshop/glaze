import { GlazePluginConfig, GlazePluginControl } from '@glaze/types'
import { CommonTimestamp } from './time'
import { UserEntity } from './user'

/**
 * 插件类型
 */
export enum GlazePluginTypeEnum {
  /** 公开插件 */
  PUBLIC = 'PUBLIC',
  /** 私有插件 */
  PRIVATE = 'PRIVATE'
}

export type GlazePluginType = `${GlazePluginTypeEnum}`

export interface GlazePluginEntity extends CommonTimestamp {
  id: string
  name: string
  desc?: string | null
  icon?: string | null
  path: string
  configSchema?: Record<string, GlazePluginControl>
  type: GlazePluginType
  lastUpdateBy?: UserEntity
  ownerTeamId: number
}

export interface ProjectUsedPlugin {
  id: number
  projectId: number
  pluginId: number
}
