import { Length } from './length'

export enum PositionType {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right'
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

export enum LayoutOption {
  WIDTH = 'width',
  HEIGHT = 'height',
  POSITION = 'position'
}
