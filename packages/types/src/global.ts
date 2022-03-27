import { GlazeNode, GlazeStructure } from './component'
import { RegisterPluginConfig } from './extensionConfig'
import { NodeListener } from './listener'

declare global {
  interface Window {
    GLAZE_DEPLOYMENT_ID: number
    GLAZE_PROJECT_ID: number
    GLAZE_NODES: Record<string, GlazeNode>
    GLAZE_STRUCTURE: GlazeStructure[]
    GLAZE_PLUGIN_CONFIG: Record<string, any>
    GLAZE_REGISTERED_PLUGIN_MAP: [string, RegisterPluginConfig][]
    GLAZE_NODE_LISTENER: NodeListener[]
    GLAZE_ACTION: {
      getUserConfig: (id: string) => Record<string, any>
      registerPlugin: (
        id: string,
        configFunction: (
          pluginConfig: Record<string, any>
        ) => RegisterPluginConfig | void
      ) => void
      registerNodeListener: (listener: NodeListener) => void
    }
  }
}
