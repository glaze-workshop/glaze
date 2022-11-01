import * as Y from 'yjs'
import { LayoutOption, PositionType, Length } from '@glaze/types'
import { findPosArrTargetNoobIndex } from './layout.utils'

export const widthUpdater = (yMap: any, newValue: Length): void => {
  yMap.set(LayoutOption.WIDTH, newValue)
}

export const heightUpdater = (yMap: any, newValue: Length): void => {
  yMap.set(LayoutOption.HEIGHT, newValue)
}

export const positionUpdater = (yMap: Y.Map<any>, newValue: [PositionType, number]): void => {
  const positionData = yMap.get(LayoutOption.POSITION)
  const { type } = positionData
  const targetAttr = newValue[0]
  const targetValue = newValue[1]
  const [targetIndex, noobIndex] = findPosArrTargetNoobIndex(type, targetAttr)
  const noobAttr = type[noobIndex]
  const noobValue = positionData[noobAttr]
  const newObj = {
    [targetAttr]: targetValue,
    [noobAttr]: noobValue,
    type: [noobAttr, targetAttr]
  }
  yMap.set(LayoutOption.POSITION, newObj)
}
