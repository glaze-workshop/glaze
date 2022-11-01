import { PositionType, LengthUnit } from '@glaze/types'

export const LRpositionOption: Array<PositionType> = [PositionType.LEFT, PositionType.RIGHT]

export const TBpositionOption: Array<PositionType> = [PositionType.TOP, PositionType.BOTTOM]

export const lengthOption: Array<LengthUnit> = [
  LengthUnit.AUTO,
  LengthUnit.FIXED,
  LengthUnit.PERCENT
]
