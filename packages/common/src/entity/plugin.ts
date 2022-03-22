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

export interface GlazePluginEntity {
  id: string
  name: string
  desc?: string
  icon?: string
  path: string
  type: GlazePluginType
  ownerTeamId: number
}

export interface ProjectUsedPlugin {
  id: number
  projectId: number
  pluginId: number
}
