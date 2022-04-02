import { GlazeNode } from './component'

export enum GlazePluginControlType {
  /** a numeric text box input */
  NUMBER = 'number',

  /** simple text input */
  TEXT = 'text',
}

export interface AbstractControl<
  T extends GlazePluginControlType = GlazePluginControlType,
  D = unknown
> {
  name: string
  type: T
  default?: D
  required?: boolean
}

export interface GlazePluginNumberControl
  extends AbstractControl<GlazePluginControlType.NUMBER, number> {
  min?: number
  max?: number
}

export interface GlazePluginTextControl
  extends AbstractControl<GlazePluginControlType.TEXT, string> {}

export type GlazePluginControl =
  | GlazePluginNumberControl
  | GlazePluginTextControl

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

  config?: Record<string, GlazePluginControl>
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

export interface RegisterPluginConfig {
  click?: (e: MouseEvent, node: GlazeNode, nodeRef: HTMLElement) => void
  scroll?: (e: Event) => void
}
