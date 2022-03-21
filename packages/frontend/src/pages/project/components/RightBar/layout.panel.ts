import { PositionType } from '../../../../schema/layout'
import { LengthUnit } from '../../../../schema/length'

export const positionOption: Array<PositionType> = [
  PositionType.TOP,
  PositionType.BOTTOM,
  PositionType.LEFT,
  PositionType.RIGHT
]

export const lengthOption: Array<LengthUnit> = [
  LengthUnit.AUTO,
  LengthUnit.FIXED,
  LengthUnit.PERCENT
]
