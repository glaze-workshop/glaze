export enum GlazeMessageType {
  HEATMAP_READY = 'HEATMAP_READY',
  SET_CLICK_DATA = 'SET_CLICK_DATA',
}

export interface AbstractMessage<T extends GlazeMessageType, D> {
  type: T
  data: D
}

export interface HeatmapReadyMessage
  extends AbstractMessage<GlazeMessageType.HEATMAP_READY, undefined> {}

export interface ClickData {
  id: string
  deploymentId: number
  nodeId: string

  /** 时间戳 */
  time: string
  path: string
  position: { x: number; y: number }
}

export interface SetClickDataMessage
  extends AbstractMessage<GlazeMessageType.SET_CLICK_DATA, ClickData[]> {}

export type GlazeMessage = HeatmapReadyMessage | SetClickDataMessage

export function isGlazeMessage(data: any): data is GlazeMessage {
  return data && typeof data === 'object' && 'type' in data && 'data' in data
}
