import * as Y from 'yjs'

export interface LayoutSelectorProps {
  defaultValue: string
  fullOptions: Array<any>
}

export interface LayoutNumberCounterProps {
  defaultValue: any
  yMap: Y.Map<any>
}

export interface YMapUpdater<T> {
  (yMap: Y.Map<T>, newValue: T): void
}
