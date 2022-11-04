import styled from '@emotion/styled'
import { Transform, Zoom } from '@glaze/zoom'
import { FC, memo, RefObject, useEffect, useRef } from 'react'
import {
  AllCooperateUserState,
  AllNodeInfoObservableMap,
  SelectedNodeInfoSubject,
  StaticPosition
} from './state'
import { combineLatestWith, map, mergeMap, of, Subscription, switchMap } from 'rxjs'
import { notEmpty } from '../../utils/null'
import { difference } from 'lodash'
import { getNodeIdInStructTree } from './yjs.hook'

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

function drawRect(
  position: StaticPosition,
  zoom: Zoom,
  transform: Transform,
  rectRef: SVGRectElement
) {
  const { x: staticX, y: staticY, width: staticWidth, height: staticHeight } = position
  const { x, y } = zoom.apply({ x: staticX, y: staticY })
  const width = staticWidth * transform.k
  const height = staticHeight * transform.k

  rectRef.style.visibility = 'visible'
  rectRef.setAttribute('x', `${x}px`)
  rectRef.setAttribute('y', `${y}px`)
  rectRef.setAttribute('width', `${width}px`)
  rectRef.setAttribute('height', `${height}px`)
}

const EditorUpper: FC<EditorUpperProps> = ({ zoom }) => {
  const rectRef = useRef<SVGRectElement>(null)
  const parentRef = useRef<SVGRectElement>(null)
  const upperRef = useRef<SVGSVGElement>(null)
  useAllCooperatorSelection(upperRef, zoom)

  useEffect(() => {
    const rect = rectRef.current
    const parent = parentRef.current
    const subscriber = SelectedNodeInfoSubject.pipe(
      switchMap((id) => (notEmpty(id) ? AllNodeInfoObservableMap.observeKey(id) : of(null))),
      switchMap((nodeInfo) => {
        if (nodeInfo && nodeInfo.parentStructureInfo) {
          const parentId = getNodeIdInStructTree(nodeInfo.parentStructureInfo)
          if (notEmpty(parentId)) {
            return AllNodeInfoObservableMap.observeKey(parentId).pipe(
              map((pInfo) => [nodeInfo, pInfo])
            )
          }
        }
        return of([nodeInfo, null])
      }),
      combineLatestWith(zoom.subject)
    ).subscribe(([[nodeInfo, pInfo], transform]) => {
      if (nodeInfo && rect && parent) {
        drawRect(nodeInfo.position, zoom, transform, rect)
        if (pInfo) {
          drawRect(pInfo.position, zoom, transform, parent)
        }
      }
      if (rect && !nodeInfo) {
        rect.style.visibility = 'hidden'
      }
      if (parent && !pInfo) {
        parent.style.visibility = 'hidden'
      }
    })
    return () => {
      subscriber.unsubscribe()
      if (rect) {
        rect.style.visibility = 'hidden'
      }
      if (parent) {
        parent.style.visibility = 'hidden'
      }
    }
  }, [zoom])

  return (
    <Upper ref={upperRef} xmlns="http://www.w3.org/2000/svg">
      <rect ref={parentRef} fill="none" stroke="yellow" strokeWidth={2} strokeDasharray="4" />
      <g>
        <rect ref={rectRef} fill="none" stroke="blue" strokeWidth={2} />
      </g>
    </Upper>
  )
}
export default memo(EditorUpper)

export function useAllCooperatorSelection(upperRef: RefObject<SVGSVGElement>, zoom: Zoom) {
  const rectsRef = useRef<Map<number, SVGRectElement>>(new Map())
  const subscriptionMap = useRef<Map<number, [string | null, Subscription | null]>>(new Map())

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
      mergeMap((stateList) => stateList)
    ).subscribe(({ selectedNodeId, clientId, userInfo, color }) => {
      if (notEmpty(clientId)) {
        const subInfo = subscriptionMap.current.get(clientId)
        if (subInfo?.[0] === selectedNodeId) {
          return
        }

        subInfo?.[1]?.unsubscribe()
        if (notEmpty(selectedNodeId)) {
          const subscription = AllNodeInfoObservableMap.observeKey(selectedNodeId)
            .pipe(combineLatestWith(zoom.subject))
            .subscribe(([nodeInfo, transform]) => {
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
            })
          subscriptionMap.current.set(clientId, [selectedNodeId, subscription])
        } else {
          subscriptionMap.current.set(clientId, [null, null])
          // 未选中则方块消失
          const clientRect = rectMap.get(clientId)
          if (clientRect) {
            clientRect.style.visibility = 'hidden'
          }
        }
      }
    })

    const subscriptionMapRef = subscriptionMap.current
    return () => {
      AllCooperateUserState.next([])
      subscription.unsubscribe()
      subscriptionMapRef.forEach((sub) => sub?.[1]?.unsubscribe())
      subscriptionMapRef.clear()
    }
  }, [upperRef, zoom])
}
