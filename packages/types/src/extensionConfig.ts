export interface GlazePluginConfig {

  /** 自定义，保证唯一性 */
  id: string

  /** 插件名称 */
  name: string

  /** 插件描述 */
  desc?: string

  /** 插件图标 */
  icon?: string

  /** 插件权限，默认私有 */
  type?: 'PRIVATE' | 'PUBLIC'

  /** 插件文件入口 */
  main: string
}

export interface GlazeGeneratedConfig {
  /** 自动生成，用户选择 */
  ownerTeamId: number
}

export interface GlazeConfig {

  plugins: GlazePluginConfig[]

  /** 不要修改 */
  generated: GlazeGeneratedConfig
}
