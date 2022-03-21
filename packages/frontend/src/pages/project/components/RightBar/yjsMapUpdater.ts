import * as Y from 'yjs'
import { PositionConfig, LayoutOption } from '../../../../schema/layout'
import { Length } from '../../../../schema/length'

export const widthUpdater = (yMap: Y.Map<any>, newValue: Length): void => {
  yMap.set(LayoutOption.WIDTH, newValue)
}

export const heightUpdater = (yMap: Y.Map<any>, newValue: Length): void => {
  yMap.set(LayoutOption.HEIGHT, newValue)
}

export const positionUpdater = (
  yMap: Y.Map<any>,
  newValue: PositionConfig
): void => {
  yMap.set(LayoutOption.POSITION, newValue)
}
