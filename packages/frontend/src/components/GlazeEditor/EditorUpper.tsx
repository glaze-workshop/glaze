import styled from '@emotion/styled'
import { Zoom } from '@glaze/zoom'
import { useObservableEagerState } from 'observable-hooks'
import React, { FC, memo, useCallback, useEffect, useRef } from 'react'
import { AllNodeInfoObservableMap, EditorPositionSubject, SelectedNodeInfoSubject } from './state'
import { combineLatestWith, mergeMap, of, switchMap } from 'rxjs'
import { notEmpty } from '../../utils/null'

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
  const rectRef = useRef<SVGRectElement>(null)

  useEffect(() => {
    const subscriber = SelectedNodeInfoSubject.pipe(
      switchMap((id) =>
        notEmpty(id) ? AllNodeInfoObservableMap.observeKey(id) : of(null)
      ),
      combineLatestWith(zoom.subject)
    ).subscribe(([nodeInfo, transform]) => {
      if (nodeInfo && rectRef.current) {
        const { x: staticX, y: staticY, width: staticWidth, height: staticHeight } = nodeInfo.position
        const { x, y } = zoom.apply({ x: staticX, y: staticY })
        const width = staticWidth * transform.k
        const height = staticHeight * transform.k

        rectRef.current.style.visibility = 'visible'
        rectRef.current.setAttribute('x', `${x}px`)
        rectRef.current.setAttribute('y', `${y}px`)
        rectRef.current.setAttribute('width', `${width}px`)
        rectRef.current.setAttribute('height', `${height}px`)
      } else if (rectRef.current) {
        rectRef.current.style.visibility = 'hidden'
      }
    })
    return () => subscriber.unsubscribe()
  }, [zoom])

  return (
    <Upper xmlns="http://www.w3.org/2000/svg">
      <rect ref={rectRef} fill='none' stroke='blue' strokeWidth={2} />
    </Upper>
  )
}
export default memo(EditorUpper)
