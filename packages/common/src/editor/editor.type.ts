// ========== Component 相关 ==========
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
  name: string
  state: EditorComponentState
  targetPath: string
}

export interface EditorComponentInfoInternal extends EditorComponentInfo {
  sourcePath: string
  compiler: any
}

// ...

export enum EditorCenterEventType {
  ComponentListUpdate = 'componentListUpdate',
  ComponentCreate = 'componentCreate',
  ComponentRemove = 'componentRemove',
  ComponentUpdate = 'componentUpdate'
}

export interface EditorCenterEvent {
  type: EditorCenterEventType
  componentName?: string
  requestUrl?: string
}
