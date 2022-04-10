import styled from '@emotion/styled'
import { Zoom } from '@glaze/zoom'
import { FC, memo, RefObject, useEffect, useRef } from 'react'
import { AllCooperateUserState, AllNodeInfoObservableMap, SelectedNodeInfoSubject } from './state'
import { combineLatestWith, filter, from, map, mergeMap, of, switchMap } from 'rxjs'
import { notEmpty } from '../../utils/null'
import { difference } from 'lodash'

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
  const upperRef = useRef<SVGSVGElement>(null)
  useAllCooperatorSelection(upperRef, zoom)

  useEffect(() => {
    const subscriber = SelectedNodeInfoSubject.pipe(
      switchMap((id) => (notEmpty(id) ? AllNodeInfoObservableMap.observeKey(id) : of(null))),
      combineLatestWith(zoom.subject)
    ).subscribe(([nodeInfo, transform]) => {
      if (nodeInfo && rectRef.current) {
        const {
          x: staticX,
          y: staticY,
          width: staticWidth,
          height: staticHeight
        } = nodeInfo.position
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
    <Upper ref={upperRef} xmlns="http://www.w3.org/2000/svg">
      <rect ref={rectRef} fill="none" stroke="blue" strokeWidth={2} />
    </Upper>
  )
}
export default memo(EditorUpper)

export function useAllCooperatorSelection(upperRef: RefObject<SVGSVGElement>, zoom: Zoom) {
  const rectsRef = useRef<Map<number, SVGRectElement>>(new Map())

  useEffect(() => {
    const rectMap = rectsRef.current
    const subscription = AllCooperateUserState.pipe(
      map((stateList) => {
        const allClientIds = stateList.map((state) => state.clientId).filter(notEmpty)
        const rectRemoved = difference(Array.from(rectMap.keys()), allClientIds)
        rectRemoved.forEach((id) => {
          const rect = rectMap.get(id)
          if (rect) {
            rect.remove()
            rectMap.delete(id)
          }
        })
        return stateList
      }),
      mergeMap((stateList) => from(stateList)),
      filter((state) => notEmpty(state.clientId)),
      switchMap(({ selectedNodeId, clientId, userInfo, color }) => {
        const nodeObservable = notEmpty(selectedNodeId)
          ? AllNodeInfoObservableMap.observeKey(selectedNodeId)
          : of(null)
        return nodeObservable.pipe(
          map((nodeInfo) => ({ nodeInfo, clientId, userInfo, color })),
          combineLatestWith(zoom.subject)
        )
      })
    ).subscribe(([{ nodeInfo, clientId, color }, transform]) => {
      function setNodePosition(rect: SVGRectElement) {
        if (nodeInfo) {
          const {
            x: staticX,
            y: staticY,
            width: staticWidth,
            height: staticHeight
          } = nodeInfo.position
          const { x, y } = zoom.apply({ x: staticX, y: staticY })
          const width = staticWidth * transform.k
          const height = staticHeight * transform.k
          rect.style.visibility = 'visible'
          rect.setAttribute('x', `${x}px`)
          rect.setAttribute('y', `${y}px`)
          rect.setAttribute('width', `${width}px`)
          rect.setAttribute('height', `${height}px`)
        } else {
          rect.style.visibility = 'hidden'
        }
      }
      if (notEmpty(clientId)) {
        const rect = rectMap.get(clientId)
        if (!rect) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
          rect.setAttribute('fill', 'none')
          rect.setAttribute('stroke', color!)
          rect.setAttribute('stroke-width', '2')
          rect.style.visibility = 'hidden'
          upperRef.current?.appendChild(rect)
          rectMap.set(clientId, rect)
          setNodePosition(rect)
        } else {
          setNodePosition(rect)
        }
      }
    })

    return () => {
      AllCooperateUserState.next([])
      subscription.unsubscribe()
    }
  }, [upperRef, zoom])
}
