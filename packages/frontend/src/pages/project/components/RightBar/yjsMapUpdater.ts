import { PositionConfig, LayoutOption } from '../../../../schema/layout'
import { Length } from '../../../../schema/length'
import { YMapUpdater } from './type'

export const widthUpdater: YMapUpdater<Length> = (yMap, newValue): void => {
  yMap.set(LayoutOption.WIDTH, newValue)
}

export const heightUpdater: YMapUpdater<Length> = (yMap, newValue): void => {
  yMap.set(LayoutOption.HEIGHT, newValue)
}

export const positionUpdater: YMapUpdater<PositionConfig> = (
  yMap,
  newValue
): void => {
  yMap.set(LayoutOption.POSITION, newValue)
}
