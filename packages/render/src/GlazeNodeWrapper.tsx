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
export function useNodeLayout (layoutConfig: LayoutConfig) {
  return useMemo(() => ({
    width: lengthToStyle(layoutConfig.width),
    height: lengthToStyle(layoutConfig.height),
    top: `${layoutConfig.position.top}px`,
    left: `${layoutConfig.position.left}px`
  }), [layoutConfig])
}

function GlazeNodeWrapper ({ nodeInfo, structureInfo, enableLayout }: GlazeNodeWrapperProps) {
  const layoutStyle = useNodeLayout(nodeInfo.layout)

  const CurrentComponent = BasicComponents[nodeInfo.componentId]

  const child = CurrentComponent &&
    <CurrentComponent {...nodeInfo.props}>
      {structureInfo.children.map(child => (
        <GlazeNodeWrapper
          key={child.nodeId}
          nodeInfo={window.GLAZE_NODES[child.nodeId]}
          structureInfo={child}
          enableLayout />
      ))}
    </CurrentComponent>

  if (enableLayout) {
    return child
  } else {
    return (
      <NodeWrapper style={enableLayout ? layoutStyle : undefined}>
        {child}
      </NodeWrapper>
    )
  }
}

export default memo(GlazeNodeWrapper)
