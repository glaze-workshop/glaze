import React, { FC, memo, useMemo } from 'react'
import { GlazeNode, GlazeStructure, LayoutConfig, Length, LengthUnit } from './glaze.type'
import styled from '@emotion/styled'
import { BasicComponents } from './BasicComponents'

const NodeWrapper = styled.div`
  position: absolute;
`
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
export function useNodeLayout (layoutConfig: LayoutConfig, enableLayout = true) {
  return useMemo(() => enableLayout
    ? ({
        width: lengthToStyle(layoutConfig.width),
        height: lengthToStyle(layoutConfig.height),
        top: `${layoutConfig.position.top}px`,
        left: `${layoutConfig.position.left}px`
      })
    : ({
        height: lengthToStyle(layoutConfig.height)
      }), [enableLayout, layoutConfig.height, layoutConfig.position.left, layoutConfig.position.top, layoutConfig.width])
}

function GlazeNodeWrapper ({ nodeInfo, structureInfo, enableLayout }: GlazeNodeWrapperProps) {
  const layoutStyle = useNodeLayout(nodeInfo.layout, enableLayout)

  const CurrentComponent = BasicComponents[nodeInfo.componentId]

  return (
    <NodeWrapper style={layoutStyle}>
      {<CurrentComponent {...nodeInfo.props}>
        {structureInfo.children.map(child => (
          <GlazeNodeWrapper
          key={child.nodeId}
          nodeInfo={window.GLAZE_NODES[child.nodeId]}
          structureInfo={child}
          enableLayout />
        ))}
      </CurrentComponent>}
    </NodeWrapper>)
}

export default memo(GlazeNodeWrapper)
