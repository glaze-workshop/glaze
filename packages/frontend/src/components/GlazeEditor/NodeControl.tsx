import styled from '@emotion/styled'
import { useObservableEagerState } from 'observable-hooks'
import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react'
import { map } from 'rxjs'
import * as Y from 'yjs'
import { LayoutConfig } from '../../schema/layout'
import { AllComponentsSubject, SelectedNodeInfoSubject, useNodeInfoObserve } from './state'
import {
  NodeProxy,
  StructureProxy,
  useNodeLayout,
  useYjsMapProxy,
  useYjsRerender
} from './yjs.hook'
import { editorSharedDocument } from './EditorSharedDocument'
import { nanoid } from 'nanoid'
import { ReactRndEnhance } from '../react-rnd-enhance'
import { TUpdateHandle, TPosition, TSize } from '../react-rnd-enhance/type'
import { PositionType } from '../../schema/layout'
import { LengthUnit, Length } from '../../schema/length'
import { layout } from '@chakra-ui/react'

const NodeControlWrapper = styled.div`
  position: absolute;
`

export interface NodeControlProps {
  nodeInfo: Y.Map<any>
  structureInfo: Y.Map<any>
  parentStructureInfo?: Y.Map<any>
}

function NodeControl({ nodeInfo, structureInfo, parentStructureInfo }: NodeControlProps) {
  const nodeProxy = useYjsMapProxy<NodeProxy>(nodeInfo)
  const structureProxy = useYjsMapProxy<StructureProxy>(structureInfo)
  let layoutProxy = useYjsMapProxy<LayoutConfig>(nodeProxy.layout)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lr = layoutProxy.position.type[0] === 'left' ? PositionType.LEFT : PositionType.RIGHT
  const tb = layoutProxy.position.type[1] === 'top' ? PositionType.TOP : PositionType.BOTTOM

  const nodePosition = {
    x: 0,
    y: 0
  }

  const nodeSize = {
    width: layoutProxy.width[1],
    height: layoutProxy.height[1]
  }

  const dragUpdate: TUpdateHandle = (id, ref, x, y) => {
    // setNode((pre) => [
    //   ...pre.filter((node) => node.id !== id),
    //   { ...pre.filter((node) => node.id === id)[0], position: { x, y } }
    // ])
    const position = {
      type: [lr, tb],
      [lr]: x,
      [tb]: y
    }

    layoutProxy.position = position
  }

  const resizeUpdate: TUpdateHandle = (id, ref, x, y) => {
    // setNode((pre) => [
    //   ...pre.filter((node) => node.id !== id),
    //   {
    //     ...pre.filter((node) => node.id === id)[0],
    //     position: { x, y },
    //     size: {
    //       width: ref.getBoundingClientRect().width,
    //       height: ref.getBoundingClientRect().height
    //     }
    //   }
    // ])
    const width: Length = [LengthUnit.FIXED, ref.getBoundingClientRect().width]
    const height: Length = [LengthUnit.FIXED, ref.getBoundingClientRect().height]

    layoutProxy.width = width
    layoutProxy.height = height
  }

  useYjsRerender(nodeInfo, nodeProxy.layout, nodeProxy.props, structureProxy.children)
  useNodeInfoObserve(nodeProxy, structureProxy, wrapperRef, parentStructureInfo)

  const componentObservable = useMemo(
    () => AllComponentsSubject.pipe(map((components) => components.get(nodeProxy.componentId))),
    [nodeProxy.componentId]
  )
  const componentFullInfo = useObservableEagerState(componentObservable)

  const layoutStyle = useNodeLayout(layoutProxy)

  const handleWrapperClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation()
      if (wrapperRef.current) {
        SelectedNodeInfoSubject.next(nodeProxy.id)
      }
    },
    [nodeProxy]
  )

  return (
    <NodeControlWrapper ref={wrapperRef} style={layoutStyle} onClick={handleWrapperClick}>
      {componentFullInfo && (
        <ReactRndEnhance
          key={nodeProxy.id}
          id={nodeProxy.id}
          position={nodePosition as TPosition}
          size={nodeSize as TSize}
          dragUpdate={dragUpdate}
          resizeUpdate={resizeUpdate}
          // bounds={'parent'}
          style={{ background: 'red' }}
        >
          <componentFullInfo.component {...nodeProxy.props.toJSON()}>
            {structureProxy.children.map((children) => (
              <NodeControl
                key={children.get('nodeId')}
                nodeInfo={editorSharedDocument.nodeList.get(children.get('nodeId'))!}
                parentStructureInfo={structureInfo}
                structureInfo={children}
              />
            ))}
          </componentFullInfo.component>
        </ReactRndEnhance>
      )}
    </NodeControlWrapper>
  )
}
export default memo(NodeControl)
