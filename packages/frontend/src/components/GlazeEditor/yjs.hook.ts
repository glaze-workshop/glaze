import { useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'
import { useForceRerender } from '../../hooks/utils.hook'
import { ControlType } from '../../schema/config'
import { LayoutConfig, PositionConfig } from '../../schema/layout'
import { Length, LengthUnit } from '../../schema/length'

export interface StructureProxy {
  nodeId: string // node id
  children: Y.Array<Y.Map<any>>
  /** 原始的 y 节点 */
  readonly yNode: Y.Map<any>
}

export interface NodeProxy {
  /** 节点的id */
  id: string

  /** 节点的名称 */
  name: string

  /** 使用的组件的id */
  componentId: string

  /** 配置的组件 props */
  props: Y.Map<any>

  /** 组件布局信息 */
  layout: Y.Map<any>

  /** 组件的跳转链接 */
  to?: string

  /** 原始的 y 节点 */
  readonly yNode: Y.Map<any>
}

export function createYjsMapProxy<T>(yNode: Y.Map<any>): T {
  return new Proxy(yNode, {
    get(target, prop) {
      if (prop === 'yNode') {
        return target
      }
      return target.get(prop.toString())
    },
    set(target, prop, value) {
      target.set(prop.toString(), value)
      return true
    }
  }) as unknown as T
}

const lengthToStyle = (length: Length) => {
  const [type, num] = length
  switch (type) {
    case LengthUnit.AUTO:
      return 'auto'
    case LengthUnit.FIXED:
      return `${num}px`
    case LengthUnit.PERCENT:
      return `${num}%`
  }
}

export const positionToStyle = (position: PositionConfig) => {
  const { type, top, left, right, bottom } = position
}

export function useNodeLayout(layoutProxy: LayoutConfig) {
  // 理论上不存在，但是由于没有进行严格类型检查，可能存在漏网之鱼，补一手
  if (!layoutProxy || !layoutProxy.position) {
    console.log('layoutProxy', layoutProxy)
    return {}
  }

  const {
    position: { top, right, bottom, left },
    width,
    height
  } = layoutProxy

  const style: any = {
    width: lengthToStyle(width),
    height: lengthToStyle(height)
  }
  top && (style.top = `${top}px`)
  left && (style.left = `${left}px`)
  right && (style.right = `${right}px`)
  bottom && (style.bottom = `${bottom}px`)
  return style
}

export function useYjsMapProxy<T>(yMap: Y.Map<any>) {
  return useMemo(() => createYjsMapProxy<T>(yMap), [yMap])
}

export function useYjsRerender(...yjsObjects: Y.AbstractType<any>[]) {
  const forceRender = useForceRerender()
  useEffect(() => {
    yjsObjects.forEach((obj) => {
      obj.observe(forceRender)
    })
    return () => {
      yjsObjects.forEach((obj) => {
        obj.unobserve(forceRender)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceRender, ...yjsObjects])
}
