import { ILine, basicLine } from './shape'
import { TPosition } from './type'

interface ICompareNode {
  x: number
  y: number
  w: number
  h: number
}

const getPosRelativeParent = (el: HTMLElement, parentEl?: HTMLElement): ICompareNode => {
  let parent = parentEl || (el.parentNode as HTMLElement)
  let parentRect = parent.getBoundingClientRect()
  let elRect = el.getBoundingClientRect()

  return {
    x: Math.floor(elRect.x - parentRect.x),
    y: Math.floor(elRect.y - parentRect.y),
    w: elRect.width,
    h: elRect.height
  }
}

// 實時檢測座標並吸附
const detection = (
  target: ICompareNode,
  source: Array<ICompareNode>,
  position: TPosition,
  threshold: number = 5
): { x: number; y: number; isBlend: boolean } => {
  let isBlend = false
  let { x, y } = position

  for (let i = 0; i < source.length; i++) {
    const node = source[i]

    let x1 = node.x
    let x2 = node.x + node.w
    let y1 = node.y
    let y2 = node.y + node.h

    if (x === x1 || y === y1 || x + target.w === x2 || y + target.h === y2) {
      return { x, y, isBlend: true }
    }

    if (Math.abs(target.x - x1) <= threshold) {
      x = x1
    } else if (Math.abs(target.x - x2) <= threshold) {
      x = x2
    } else if (Math.abs(target.x + target.w - x1) <= threshold) {
      x = x1 - target.w
    } else if (Math.abs(target.x + target.w - x2) <= threshold) {
      x = x2 - target.w
    }

    if (Math.abs(target.y - y1) <= threshold) {
      y = y1
    } else if (Math.abs(target.y - y2) <= threshold) {
      y = y2
    } else if (Math.abs(target.y + target.h - y1) <= threshold) {
      y = y1 - target.h
    } else if (Math.abs(target.y + target.h - y2) <= threshold) {
      y = y2 - target.h
    }

    // x軸中心對比
    if (Math.abs(target.w / 2 + target.x - (node.w / 2 + node.x)) <= threshold) {
      x = node.w / 2 + node.x - target.w / 2
    }

    // y軸中心對比
    if (Math.abs(target.h / 2 + target.y - (node.h / 2 + node.y)) <= threshold) {
      y = node.h / 2 + node.y - target.h / 2
    }
  }

  // 如果和原來座標不等，說明已經執行過吸附操作了
  if (x !== position.x || y !== position.y) {
    isBlend = true
  }
  return { x, y, isBlend }
}

const getMaxAxis = (nodes: Array<ICompareNode>, type: 'x' | 'y') => {
  let arr: Array<number> = []
  nodes.forEach((node) => {
    if (type === 'x') {
      arr.push(node.x)
      arr.push(node.x + node.w)
    } else if (type === 'y') {
      arr.push(node.y)
      arr.push(node.y + node.h)
    }
  })
  let min = [...arr].sort((a, b) => a - b)[0]
  let max = [...arr].sort((a, b) => b - a)[0]
  return max - min
}

// 計算並返回輔助線數據
const getLineInfo = (
  target: ICompareNode,
  source: Array<ICompareNode>,
  threshold: number = 1
): ILine => {
  let leftEq: Array<ICompareNode> = []
  let rightEq: Array<ICompareNode> = []
  let topEq: Array<ICompareNode> = []
  let bottomEq: Array<ICompareNode> = []
  let xCenterEq: Array<ICompareNode> = []
  let yCenterEq: Array<ICompareNode> = []

  // 初始值
  let lw = 1,
    lt = 0,
    lh = 0
  let rw = 1,
    rt = 0,
    rh = 0
  let th = 1,
    tw = 0,
    tl = 0
  let bh = 1,
    bw = 0,
    bl = 0
  let cl = 0,
    cxw = 1,
    cxh = 0,
    cyw = 0,
    cyh = 1,
    ct = 0

  source.forEach((node) => {
    let x1 = node.x
    let x2 = node.x + node.w
    let y1 = node.y
    let y2 = node.y + node.h

    // 和 target 左邊對比
    if (Math.abs(target.x - x1) <= threshold || Math.abs(target.x - x2) <= threshold) {
      leftEq.push(node)
    }

    // 和 target 右邊對比
    if (
      Math.abs(target.x + target.w - x1) <= threshold ||
      Math.abs(target.x + target.w - x2) <= threshold
    ) {
      rightEq.push(node)
    }

    // 和 target 上邊對比
    if (Math.abs(target.y - y1) <= threshold || Math.abs(target.y - y2) <= threshold) {
      topEq.push(node)
    }

    // 和 target 下邊對比
    if (
      Math.abs(target.y + target.h - y1) <= threshold ||
      Math.abs(target.y + target.h - y2) <= threshold
    ) {
      bottomEq.push(node)
    }

    // x軸中心對比
    if (Math.abs(target.w / 2 + target.x - (node.w / 2 + node.x)) <= threshold) {
      xCenterEq.push({ ...node, x: node.w / 2 + node.x })
    }

    // y軸中心對比
    if (Math.abs(target.h / 2 + target.y - (node.h / 2 + node.y)) <= threshold) {
      yCenterEq.push({ ...node, y: node.h / 2 + node.y })
    }
  })

  if (leftEq.length > 0) {
    // 找到最小y
    let leftMinY = [...leftEq, target].sort((a, b) => a.y - b.y)[0].y
    lh = getMaxAxis([...leftEq, target], 'y')
    lt = leftMinY > target.y ? lh - target.y : -(target.y - leftMinY)
  }

  if (rightEq.length > 0) {
    let rightMinY = [...rightEq, target].sort((a, b) => a.y - b.y)[0].y
    rh = getMaxAxis([...rightEq, target], 'y')
    rt = rightMinY > target.y ? rh - target.y : -(target.y - rightMinY)
  }

  if (topEq.length > 0) {
    let topMinX = [...topEq, target].sort((a, b) => a.x - b.x)[0].x
    tw = getMaxAxis([...topEq, target], 'x')
    tl = topMinX > target.x ? tw - target.x : -(target.x - topMinX)
  }

  if (bottomEq.length > 0) {
    let bottomMinX = [...bottomEq, target].sort((a, b) => a.x - b.x)[0].x
    bw = getMaxAxis([...bottomEq, target], 'x')
    bl = bottomMinX > target.x ? bw - target.x : -(target.x - bottomMinX)
  }

  if (xCenterEq.length > 0) {
    let leftMinY = [...xCenterEq, target].sort((a, b) => a.y - b.y)[0].y
    cxh = getMaxAxis([...xCenterEq, target], 'y')
    lt = leftMinY > target.y ? lh - target.y : -(target.y - leftMinY)
    cl = target.w / 2
  }

  if (yCenterEq.length > 0) {
    let topMinX = [...yCenterEq, target].sort((a, b) => a.x - b.x)[0].x
    cyw = getMaxAxis([...yCenterEq, target], 'x')
    tl = topMinX > target.x ? lw - target.x : -(target.x - topMinX)
    ct = target.h / 2
  }

  return {
    ...basicLine,
    lw,
    lh,
    lt,
    rw,
    rh,
    rt,
    th,
    tw,
    tl,
    bh,
    bw,
    bl,
    cl,
    ct,
    cxh,
    cxw,
    cyw,
    cyh
  }
}
export { detection, getMaxAxis, getLineInfo, getPosRelativeParent, ICompareNode }
