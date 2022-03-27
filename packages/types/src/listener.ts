import { GlazeNode } from './component'
import { ObservableMap } from './ObservableMap'

export type GlazeNodeMap = ObservableMap<string, [GlazeNode, HTMLElement]>

export interface NodeListener {
  (map: GlazeNodeMap): void | (() => void)
}
