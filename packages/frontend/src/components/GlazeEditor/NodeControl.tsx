import styled from '@emotion/styled'
import { useObservableEagerState } from 'observable-hooks'
import React, { FC, memo, useCallback, useMemo, useRef } from 'react'
import { map } from 'rxjs'
import * as Y from 'yjs'
import { LayoutConfig } from '../../schema/layout'
import { AllComponentsSubject, SelectedNodeInfoSubject, useNodeInfoObserve } from './state'
import { NodeProxy, StructureProxy, useNodeLayout, useYjsMapProxy, useYjsRerender } from './yjs.hook'
import { editorSharedDocument } from './EditorSharedDocument'

const NodeControlWrapper = styled.div`
  position: absolute;
`

export interface NodeControlProps {
  nodeInfo: Y.Map<any>
  structureInfo: Y.Map<any>
  parentStructureInfo?: Y.Map<any>
}

function NodeControl ({ nodeInfo, structureInfo, parentStructureInfo }: NodeControlProps) {
  const nodeProxy = useYjsMapProxy<NodeProxy>(nodeInfo)
  const structureProxy = useYjsMapProxy<StructureProxy>(structureInfo)
  const layoutProxy = useYjsMapProxy<LayoutConfig>(nodeProxy.layout)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useYjsRerender(nodeInfo, nodeProxy.layout, nodeProxy.props, structureProxy.children)
  useNodeInfoObserve(nodeProxy, structureProxy, wrapperRef, parentStructureInfo)

  const componentObservable = useMemo(() =>
    AllComponentsSubject.pipe(map(components => components.get(nodeProxy.componentId))), [nodeProxy.componentId])
  const componentFullInfo = useObservableEagerState(componentObservable)

  const layoutStyle = useNodeLayout(layoutProxy)

  const handleWrapperClick: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.stopPropagation()
    if (wrapperRef.current) {
      SelectedNodeInfoSubject.next(nodeProxy.id)
    }
  }, [nodeProxy])

  return (
    <NodeControlWrapper ref={wrapperRef} style={layoutStyle} onClick={handleWrapperClick}>
      {componentFullInfo &&
        <componentFullInfo.component
          {...nodeProxy.props.toJSON()}>
          {structureProxy.children.map(children => (
            <NodeControl
              key={children.get('nodeId')}
              nodeInfo={editorSharedDocument.nodeList.get(children.get('nodeId'))!}
              parentStructureInfo={structureInfo}
              structureInfo={children}
            />
          ))}
        </componentFullInfo.component>
      }
    </NodeControlWrapper>
  )
}
export default memo(NodeControl)
