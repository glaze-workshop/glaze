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
import { ReactRndEnhance } from '../react-rnd-enhance'
import { TUpdateHandle, TPosition, TSize, DragType } from '../react-rnd-enhance/type'
import { PositionType } from '../../schema/layout'
import { LengthUnit, Length } from '../../schema/length'
import { useDrag } from '../react-rnd-enhance/drag.hook'

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

  console.log('layoutProxy here', layoutProxy)

  const lr = layoutProxy.position.type[0] === 'left' ? PositionType.LEFT : PositionType.RIGHT
  const tb = layoutProxy.position.type[1] === 'top' ? PositionType.TOP : PositionType.BOTTOM

  /**
   * ? 要控制初始 position 应该也是使用 layoutProxy 的？
   * 暂时可以先放着不管
   */
  const nodePosition = {
    x: layoutProxy.position.left,
    y: layoutProxy.position.top
  }

  const nodeSize = {
    width: layoutProxy.width[1],
    height: layoutProxy.height[1]
  }

  const dragUpdate: TUpdateHandle = (id, ref, x, y) => {
    const position = {
      type: [lr, tb],
      [lr]: x,
      [tb]: y
    }

    layoutProxy.position = position
  }

  const resizeUpdate: TUpdateHandle = (id, ref, x, y) => {
    const width: Length = [LengthUnit.FIXED, ref.getBoundingClientRect().width]
    const height: Length = [LengthUnit.FIXED, ref.getBoundingClientRect().height]

    layoutProxy.width = width
    layoutProxy.height = height
  }

  useYjsRerender(nodeInfo, nodeProxy.layout, nodeProxy.props, structureProxy.children)
  useNodeInfoObserve(nodeProxy, structureProxy, wrapperRef, parentStructureInfo)

  /**
   * 自己实现拖拽效果
   */
  const dragStartPosition = useRef(layoutProxy.position)
  const onDragStart = useDrag(wrapperRef, (e, props) => {
    const { type, deltaX, deltaY } = props
    console.log('>>> draggggggggggggggging', props)
    if (type === DragType.MouseDown) {
      const { left, top } = layoutProxy.position
      dragStartPosition.current = { type: [PositionType.LEFT, PositionType.TOP], left, top }
    } else if (type === DragType.MouseMove) {
      const { left: left0 = 0, top: top0 = 0 } = dragStartPosition.current
      const [left, top] = [left0 + deltaX, top0 + deltaY]

      layoutProxy.position = { type: [PositionType.LEFT, PositionType.TOP], left, top }
    }
  })

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
    // <NodeControlWrapper
    //   ref={wrapperRef}
    //   style={layoutStyle}
    //   onClick={handleWrapperClick}
    //   onMouseDown={onDragStart}
    // >
    <div ref={wrapperRef} onClick={handleWrapperClick}>
      <ReactRndEnhance
        key={nodeProxy.id}
        id={nodeProxy.id}
        position={nodePosition as TPosition}
        size={nodeSize as TSize}
        dragUpdate={dragUpdate}
        resizeUpdate={resizeUpdate}
        // bounds={'parent'}
        // className="hover:bg-sky-700"
        // className="hover:outline-red"
        style={{ outline: '1px solid red' }}
      >
        {componentFullInfo && (
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
          // </ReactRndEnhance>
        )}
      </ReactRndEnhance>
    </div>
    // </NodeControlWrapper>
  )
}
export default memo(NodeControl)
