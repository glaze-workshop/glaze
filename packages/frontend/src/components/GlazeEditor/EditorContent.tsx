import styled from '@emotion/styled'
import { Zoom } from '@glaze/zoom'
import React, { FC, memo, useEffect, useRef } from 'react'

import { editorSharedDocument } from './EditorSharedDocument'
import NodeControl from './NodeControl'
import { useYjsRerender } from './yjs.hook'

export interface EditorContentProps {
  zoom: Zoom
}

const ContentWrapper = styled.div`
  transform-origin: 0 0;
`

const EditorContent: FC<EditorContentProps> = ({ zoom }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const subscriber = zoom.subscribe((transform) => {
      if (contentRef.current) {
        contentRef.current.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`
      }
    })
    return () => {
      subscriber.unsubscribe()
    }
  }, [zoom])

  useYjsRerender(editorSharedDocument.structureTree)

  return (
    <ContentWrapper ref={contentRef}>
      {editorSharedDocument.structureTree.map((node) => {
        const nodeInfo = editorSharedDocument.mapStructureTreeNodeToNode(node)
        return (
          <NodeControl
            key={node.get('nodeId')}
            deep={0}
            structureInfo={node}
            nodeInfo={nodeInfo!}
          ></NodeControl>
        )
      })}
    </ContentWrapper>
  )
}
export default memo(EditorContent)
