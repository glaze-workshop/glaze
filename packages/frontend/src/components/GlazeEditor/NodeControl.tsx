import styled from '@emotion/styled'
import { useObservableEagerState } from 'observable-hooks'
import React, { FC, memo, MouseEventHandler, useCallback, useMemo, useRef, useState } from 'react'
import { fromEvent, map, Subscription } from 'rxjs'
import * as Y from 'yjs'
import { LayoutConfig } from '../../schema/layout'
import {
  AllComponentsSubject,
  AllNodeInfoObservableMap,
  EditorPositionSubject,
  SelectedNodeInfoSubject,
  useNodeInfoObserve,
  zoom
} from './state'
import {
  NodeProxy,
  StructureProxy,
  useNodeLayout,
  useYjsMapProxy,
  useYjsRerender
} from './yjs.hook'
import { editorSharedDocument } from './EditorSharedDocument'

const NodeControlWrapper = styled.div`
  position: absolute;
`

export interface NodeControlProps {
  nodeInfo: Y.Map<any>
  structureInfo: Y.Map<any>
  parentStructureInfo?: Y.Map<any>
  deep: number
}

function NodeControl({ nodeInfo, structureInfo, parentStructureInfo, deep }: NodeControlProps) {
  const nodeProxy = useYjsMapProxy<NodeProxy>(nodeInfo)
  const structureProxy = useYjsMapProxy<StructureProxy>(structureInfo)
  const layoutProxy = useYjsMapProxy<LayoutConfig>(nodeProxy.layout)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useYjsRerender(nodeInfo, nodeProxy.layout, nodeProxy.props, structureProxy.children)
  useNodeInfoObserve(nodeProxy, structureProxy, wrapperRef, deep, parentStructureInfo)

  const componentObservable = useMemo(
    () => AllComponentsSubject.pipe(map((components) => components.get(nodeProxy.componentId))),
    [nodeProxy.componentId]
  )
  const componentFullInfo = useObservableEagerState(componentObservable)

  const layoutStyle = useNodeLayout(layoutProxy)

  // console.log('nodePosition here', nodePosition)
  // console.log('nodeSize here', nodeSize)
  // console.log('layoutStyle', layoutStyle)

  return (
    <NodeControlWrapper ref={wrapperRef} style={layoutStyle}>
      {componentFullInfo && (
        <componentFullInfo.component {...nodeProxy.props.toJSON()}>
          {structureProxy.children?.map((children) => (
            <NodeControl
              key={children.get('nodeId')}
              nodeInfo={editorSharedDocument.nodeList.get(children.get('nodeId'))!}
              parentStructureInfo={structureInfo}
              structureInfo={children}
              deep={deep + 1}
            />
          ))}
        </componentFullInfo.component>
      )}
    </NodeControlWrapper>
  )
}
export default memo(NodeControl)
