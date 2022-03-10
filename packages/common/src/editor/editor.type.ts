// ========== EditorCenter 相关 ==========
export enum ComponentState {
  Null = 'null',
  Updating = 'updating',
  Ready = 'ready',
  Fail = 'fail',
}

export interface ComponentInfo {
  name: string
  state: ComponentState
  sourcePath: string
}

export enum EditorCenterEventType {
  ComponentListUpdate = 'componentListUpdate',
  ComponentCreate = 'componentCreate',
  ComponentRemove = 'componentRemove',
  ComponentUpdate = 'componentUpdate',
}

export interface EditorCenterEvent {
  type: EditorCenterEventType
  componentName?: string
  requestUrl?: string
}
