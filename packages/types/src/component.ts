export enum LengthUnit {
  FIXED = 'fixed',
  PERCENT = 'percent',
  AUTO = 'auto',
}

export type Length =
  | [LengthUnit.AUTO]
  | [LengthUnit.FIXED, number]
  | [LengthUnit.PERCENT, number]

export enum PositionType {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface PositionConfig {
  type: PositionType[]
  left?: number
  top?: number
  right?: number
  bottom?: number
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
