import { PositionType } from '@glaze/types'

export const findPosArrTargetNoobIndex = (
  arr: Array<PositionType>,
  targetPos: PositionType
): [number, number] => {
  const LRIndex = arr[0] === PositionType.LEFT || arr[0] === PositionType.RIGHT ? 0 : 1
  const TBIndex = arr[0] === PositionType.TOP || arr[0] === PositionType.BOTTOM ? 0 : 1
  const targetFlag = targetPos === PositionType.LEFT || targetPos === PositionType.RIGHT
  const [targetIndex, noobIndex] = [targetFlag ? LRIndex : TBIndex, !targetFlag ? LRIndex : TBIndex]
  return [targetIndex, noobIndex]
}
