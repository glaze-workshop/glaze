import { Length } from './length'

export enum PositionType {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  LEFT_RIGHT = 'left_right',

  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
  TOP_LEFT_RIGHT = 'top_left_right',

  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_RIGHT = 'bottom_right',
  BOTTOM_LEFT_RIGHT = 'bottom_left_right',
}

export interface PositionConfig {
  type: PositionType
  left: number
  top: number
  right: number
  bottom: number
}

export interface LayoutConfig {
  width: Length
  height: Length
  position: PositionConfig
}
