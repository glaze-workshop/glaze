import LCPConnection from './LCPConnection'

export interface LCPServerSubscribeInfo<P = any> {
  connection: LCPConnection
  path: P | string
  uuid: string
  params?: any
}

// ========== ComponentsMonitor 相关 ==========
export enum ComponentsMonitorEventType {
  Ready = 'ready',
  Create = 'component-create',
  Remove = 'component-remove',
  Update = 'component-update'
}

export class ComponentsMonitorEvent {
  type: ComponentsMonitorEventType
  componentName?: string

  constructor(type: ComponentsMonitorEventType, componentName?: string) {
    this.type = type
    this.componentName = componentName
  }
}

export interface ComponentsMonitorCallback {
  (event: ComponentsMonitorEvent): void
}
