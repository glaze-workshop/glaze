// ========== Component 相关 ==========
import { GlazeComponentConfig } from '@glaze/types'

export const EditorRequestType = {
  ComponentList: 'EDITOR_REQUEST_COMPONENTLIST',
  Component: (componentName: string) =>
    `EDITOR_REQUEST_COMPONENT_${componentName}`
}

export const EditorSubscribeType = {
  ComponentList: 'EDITOR_SUBSCRIBE_COMPONENTLIST',
  Component: (componentName: string) =>
    `EDITOR_SUBSCRIBE_COMPONENT_${componentName}`
}

export enum EditorComponentState {
  Init = 'EDITOR_COMPONENT_INIT',
  Updating = 'EDITOR_COMPONENT_UPDATING',
  Ready = 'EDITOR_COMPONENT_READY',
  Fail = 'EDITOR_COMPONENT_FAIL'
}

export interface EditorComponentInfo {
  id: string
  name?: string
  state: EditorComponentState
  targetPath: string
  config: GlazeComponentConfig
}
