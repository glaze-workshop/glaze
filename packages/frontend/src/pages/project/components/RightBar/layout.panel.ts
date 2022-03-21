import { PositionType } from '../../../../schema/layout'
import { LengthUnit } from '../../../../schema/length'

export const LRpositionOption: Array<PositionType> = [
  PositionType.LEFT,
  PositionType.RIGHT
]

export const TBpositionOption: Array<PositionType> = [
  PositionType.TOP,
  PositionType.BOTTOM
]

export const lengthOption: Array<LengthUnit> = [
  LengthUnit.AUTO,
  LengthUnit.FIXED,
  LengthUnit.PERCENT
]
