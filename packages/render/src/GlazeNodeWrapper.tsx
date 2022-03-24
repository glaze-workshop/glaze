import { memo, useMemo, useRef } from 'react'
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
  return useMemo<React.CSSProperties>(
    () =>
      enableLayout
        ? {
            position: 'absolute',
            width: lengthToStyle(layoutConfig.width),
            height: lengthToStyle(layoutConfig.height),
            top: `${layoutConfig.position.top}px`,
            left: `${layoutConfig.position.left}px`,
          }
        : {
            position: 'relative',
            height: lengthToStyle(layoutConfig.height),
          },
    [
      enableLayout,
      layoutConfig.height,
      layoutConfig.position.left,
      layoutConfig.position.top,
      layoutConfig.width,
    ]
  )
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
      }
    </div>
  )
}

export default memo(GlazeNodeWrapper)
