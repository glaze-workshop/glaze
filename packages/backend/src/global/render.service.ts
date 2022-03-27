/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'

export interface RenderConfig {
  deploymentId?: number
  isPreview?: boolean
  projectId?: number
  pluginConfig?: Record<string, unknown>
  nodes?: unknown
  structure?: unknown
  pluginSrc?: string[]
  heatmap?: boolean
}

@Injectable()
export class RenderService {
  generateTemplateConfig({
    deploymentId = -1,
    isPreview = true,
    projectId = -1,
    pluginConfig = {},
    nodes = {},
    structure = [],
    pluginSrc = [],
    heatmap = false
  }: RenderConfig) {
    return {
      heatmap,
      isPreview,
      deploymentId,
      projectId,
      pluginConfig: JSON.stringify(pluginConfig),
      nodes: JSON.stringify(nodes),
      structure: JSON.stringify(structure),
      pluginSrc
    }
  }
}
