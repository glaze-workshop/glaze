import { string } from 'lib0'
import { GlazeNode, GlazeStructure } from './component'

declare global {
  interface Window {
    GLAZE_DEPLOYMENT_ID: number
    GLAZE_PROJECT_ID: number
    GLAZE_NODES: Record<string, GlazeNode>
    GLAZE_STRUCTURE: GlazeStructure[]
    GLAZE_PLUGIN_CONFIG: Record<string, any>
    GLAZE_ACTION: {
      getUserConfig: (id: string) => Record<string, any>
    }
  }
}
