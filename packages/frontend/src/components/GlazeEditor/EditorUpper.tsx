import styled from '@emotion/styled'
import { Zoom } from '@glaze/zoom'
import { useObservableEagerState } from 'observable-hooks'
import React, { FC, memo, useCallback, useEffect, useRef } from 'react'
import { EditorPositionSubject, SelectedNodeInfoSubject } from './state'

export interface EditorUpperProps {
  zoom: Zoom
}

const Upper = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const EditorUpper: FC<EditorUpperProps> = ({ zoom }) => {
  const { wrapper } = useObservableEagerState(SelectedNodeInfoSubject) ?? {}
  const { x: editorX, y: editorY } = useObservableEagerState(EditorPositionSubject) ?? {}
  const rectRef = useRef<SVGRectElement>(null)

  const changeSelectedNodePosition = useCallback(() => {
    if (wrapper) {
      const { x, y, width, height } = wrapper.getBoundingClientRect()
      if (rectRef.current) {
        rectRef.current.style.visibility = 'visible'
        rectRef.current.setAttribute('x', `${x - 2 - (editorX ?? 0)}px`)
        rectRef.current.setAttribute('y', `${y - 2 - (editorY ?? 0)}px`)
        rectRef.current.setAttribute('width', `${width + 4}px`)
        rectRef.current.setAttribute('height', `${height + 4}px`)
      }
    } else {
      if (rectRef.current) {
        rectRef.current.style.visibility = 'hidden'
      }
    }
  }, [editorX, editorY, wrapper])

  useEffect(() => {
    const zoomSubscriber = zoom.subscribe(changeSelectedNodePosition)
    return () => {
      zoomSubscriber.unsubscribe()
    }
  }, [changeSelectedNodePosition, editorX, editorY, wrapper, zoom])

  return (
    <Upper xmlns="http://www.w3.org/2000/svg">
      <rect ref={rectRef} fill='none' stroke='blue' strokeWidth={2} />
    </Upper>
  )
}
export default memo(EditorUpper)
