import LCPConnection from './agent/LCPConnection'

export interface LCPServerSubscribeInfo<P = any> {
  connection: LCPConnection
  path: P | string
  uuid: string
  params?: any
  seq: number
}

// ========== ComponentsMonitor 相关 ==========
export enum ComponentsMonitorEventType {
  Ready = 'COMPONENTS_MONITOR_READY',
  Create = 'COMPONENTS_MONITOR_CREATE',
  Remove = 'COMPONENTS_MONITOR_REMOVE',
  Update = 'COMPONENTS_MONITOR_UPDATE'
}

export interface ComponentsMonitorEvent {
  type: ComponentsMonitorEventType
  componentName?: string
}

export interface ComponentsMonitorCallback {
  (event: ComponentsMonitorEvent): void
}

// ========== utils ==========
export interface CompilerCreatorOptions {
  componentName: string
  entry: string
  onUpdate: (data: { hash: string }) => void
}
