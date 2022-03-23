/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'

export interface RenderConfig {
  isPreview?: boolean
  projectId: number
  pluginConfig?: Record<string, unknown>
  nodes?: unknown
  structure?: unknown
  pluginSrc?: string[]
}

@Injectable()
export class RenderService {
  generateTemplateConfig({
    isPreview = true,
    projectId,
    pluginConfig = {},
    nodes = {},
    structure = [],
    pluginSrc = []
  }: RenderConfig) {
    return {
      isPreview,
      projectId: projectId,
      pluginConfig: JSON.stringify(pluginConfig),
      nodes: JSON.stringify(nodes),
      structure: JSON.stringify(structure),
      pluginSrc
    }
  }
}
