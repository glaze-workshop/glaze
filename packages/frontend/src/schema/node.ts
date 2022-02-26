import { StyleConfig } from './style'
import { PositionConfig } from './layout'

export interface Node {
  id: string
  name?: string
  componentId: string
  layout: PositionConfig
  style: StyleConfig
}
