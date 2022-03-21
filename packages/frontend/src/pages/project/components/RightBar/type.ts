import * as Y from 'yjs'

export interface YMapUpdater<T> {
  (yMap: Y.Map<T>, newValue: T): void
}
