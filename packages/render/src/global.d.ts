import { GlazeNode, GlazeStructure } from '@glaze/types'
import { Entity } from '@glaze/common'

declare global {
  interface Window {
    GLAZE_NODES: Record<string, GlazeNode>
    GLAZE_STRUCTURE: GlazeStructure[]
    GLAZE_COMPONENT_CONFIG: Entity.GlazeComponentEntity[]
  }
}
