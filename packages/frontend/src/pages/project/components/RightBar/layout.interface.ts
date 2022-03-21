import * as Y from 'yjs'

export interface LayoutSelectorProps {
  defaultValue: string
  fullOptions: Array<any>
}

export interface LayoutNumberCounterProps {
  defaultValue: any
}

export interface YMapUpdater<T> {
  (yMap: Y.Map<any>, newValue: T): void
}
