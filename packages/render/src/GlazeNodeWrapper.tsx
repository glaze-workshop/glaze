import React, { memo, useMemo, useRef, Suspense, CSSProperties } from 'react'
import { BasicComponents } from './BasicComponents'
import {
  GlazeNode,
  GlazeStructure,
  Length,
  LengthUnit,
  LayoutConfig,
} from '@glaze/types'
import { useNodeInfoObserve } from './state'

export interface GlazeNodeWrapperProps {
  nodeInfo: GlazeNode
  structureInfo: GlazeStructure

  enableLayout: boolean
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
export function useNodeLayout(layoutConfig: LayoutConfig, enableLayout = true) {
  return useMemo<React.CSSProperties>(() => {
    const {
      position: { top, right, bottom, left },
      width,
      height,
    } = layoutConfig

    const style: CSSProperties = {
      position: 'absolute',
      width: lengthToStyle(width),
      height: lengthToStyle(height),
    }
    top && (style.top = `${top}px`)
    left && (style.left = `${left}px`)
    right && (style.right = `${right}px`)
    bottom && (style.bottom = `${bottom}px`)

    return enableLayout
      ? style
      : {
          position: 'relative',
          minWidth: lengthToStyle(layoutConfig.width),
          height: lengthToStyle(layoutConfig.height),
        }
  }, [enableLayout, layoutConfig])
}

function GlazeNodeWrapper({
  nodeInfo,
  structureInfo,
  enableLayout,
}: GlazeNodeWrapperProps) {
  const layoutStyle = useNodeLayout(nodeInfo.layout, enableLayout)

  const CurrentComponent = BasicComponents[nodeInfo.componentId]

  const nodeRef = useRef<HTMLDivElement>(null)

  useNodeInfoObserve(nodeInfo, nodeRef)

  return (
    <div ref={nodeRef} data-glaze-id={nodeInfo.id} style={layoutStyle}>
      {
        <Suspense>
          <CurrentComponent {...nodeInfo.props}>
            {structureInfo.children.map((child) => (
              <GlazeNodeWrapper
                key={child.nodeId}
                nodeInfo={window.GLAZE_NODES[child.nodeId]}
                structureInfo={child}
                enableLayout
              />
            ))}
          </CurrentComponent>
        </Suspense>
      }
    </div>
  )
}

export default memo(GlazeNodeWrapper)
