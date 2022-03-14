import { GlazeNode, GlazeStructure } from './glaze.type'

declare global {
  interface Window {
    GLAZE_NODES: Record<string, GlazeNode>
    GLAZE_STRUCTURE: GlazeStructure[]
  }
}
