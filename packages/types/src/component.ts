import { Control, GlazeString } from './control'
import { CSSProperties } from 'react'

export enum LengthUnit {
  FIXED = 'fixed',
  PERCENT = 'percent',
  AUTO = 'auto',
}

export type Length =
  | [`${LengthUnit.AUTO}`]
  | [`${LengthUnit.FIXED}`, number]
  | [`${LengthUnit.PERCENT}`, number]

export enum LayoutOption {
  WIDTH = 'width',
  HEIGHT = 'height',
  POSITION = 'position',
}

export enum PositionType {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface PositionConfig {
  left?: number | null
  top?: number | null
  right?: number | null
  bottom?: number | null
}

export interface LayoutConfig {
  width: Length
  height: Length
  position: PositionConfig
}

export interface GlazeNode {
  /** 节点的id */
  id: string

  /** 节点的名称 */
  name: string

  /** 使用的组件的id */
  componentId: string

  /** 配置的组件 props */
  props: Record<string, unknown>

  /** 组件布局信息 */
  layout: LayoutConfig
}

export interface GlazeStructure {
  nodeId: string
  children: GlazeStructure[]
}

export type PropsConfig<P> = {
  [key in keyof P]: Control<P[key]>
}

export type DefaultSizeConfig = {
  width: Length
  height: Length
}

/**
 * 每个组件都有的配置信息
 */
export interface ComponentConfig<T = any> {
  id: string
  name: GlazeString
  desc?: string | null
  /** 插件权限，默认私有 */
  type?: 'PRIVATE' | 'PUBLIC'
  props: PropsConfig<T>
  defaultSize: DefaultSizeConfig
  hasChildren?: boolean
  path?: string
  to?: string
}
