import styled from '@emotion/styled'
import { Point } from '@glaze/zoom'
import normalizeWheel from 'normalize-wheel'
import { FC, memo, MouseEventHandler, useCallback, useEffect, useRef } from 'react'
import EditorContent from './EditorContent'
import EditorUpper from './EditorUpper'
import {
  AllNodeInfoObservableMap,
  DuplicateNodeInfo,
  DuplicateNodeObservableMap,
  EditorPositionSubject,
  getLeftTop,
  SelectedNodeInfoSubject,
  useProjectIdChange
} from './state'
import { zoom } from './state'
import { filter, fromEvent, Subscription, switchMap } from 'rxjs'
import { editorSharedDocument } from './EditorSharedDocument'
import EditorActionDetect from './EditorActionDetect'
import { getChildrenInStructTree } from './yjs.hook'
import { notEmpty } from '@glaze/common'

export interface GlazeEditorProps {}

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const GlazeEditor: FC<GlazeEditorProps> = () => {
  const container = useRef<HTMLDivElement>(null)

  useProjectIdChange()

  useEffect(() => {
    EditorPositionSubject.next(container.current?.getBoundingClientRect() ?? null)
  }, [])

  useEffect(() => {
    if (container.current) {
      const el = container.current

      const onWheel = (event: WheelEvent) => {
        event.preventDefault()
        const e = normalizeWheel(event)
        if (event.ctrlKey) {
          const k = zoom.transform.k * Math.pow(2, 0.003 * -e.pixelY)
          const { x = 0, y = 0 } = EditorPositionSubject.value ?? {}
          const p: Point = { x: event.clientX - x, y: event.clientY - y }
          zoom.scaleBy(k, p)
        }
        zoom.scrollX(-e.pixelX * 0.3)
        zoom.scrollY(-e.pixelY * 0.3)
      }
      el.addEventListener('wheel', onWheel)
      return () => {
        el.removeEventListener('wheel', onWheel)
      }
    }
  }, [])

  const downSubscription = useRef<Subscription | null>(null)
  const duplicateSubscription = useRef<Subscription | null>(null)
  const handleMouseDown = useCallback<MouseEventHandler>((downEvent) => {
    downEvent.stopPropagation()
    downEvent.preventDefault()
    if (container.current) {
      const { x = 0, y = 0 } = EditorPositionSubject.value ?? {}
      const rawDownPoint: Point = {
        x: downEvent.clientX - x,
        y: downEvent.clientY - y
      }
      const rawInvertDownPoint = zoom.invert(rawDownPoint)
      const id = editorSharedDocument.selectNode(rawInvertDownPoint)
      if (id) {
        const node = AllNodeInfoObservableMap.getValue(id)
        if (node) {
          const relativePos: Point = {
            x: rawInvertDownPoint.x - node.position.x,
            y: rawInvertDownPoint.y - node.position.y
          }

          downSubscription.current = fromEvent<MouseEvent>(
            container.current,
            'mousemove'
          ).subscribe((e) => {
            const selectedId = SelectedNodeInfoSubject.value
            if (selectedId) {
              const node = AllNodeInfoObservableMap.getValue(selectedId)
              if (node) {
                const { x = 0, y = 0 } = EditorPositionSubject.value ?? {}
                const rawP: Point = { x: e.clientX - x, y: e.clientY - y }
                const p = zoom.invert(rawP)
                editorSharedDocument.moveNode(p, node, relativePos)
              }
            }
          })

          duplicateSubscription.current = SelectedNodeInfoSubject.pipe(
            filter(notEmpty),
            switchMap((id) => DuplicateNodeObservableMap.observeKey(id)),
            filter(notEmpty),
            filter((nodes) => nodes.size > 1)
          ).subscribe((nodes) => {
            let leftTopMin = Infinity
            let leftMostNode: DuplicateNodeInfo | null = null
            for (const node of nodes) {
              const leftTop = getLeftTop(node.position)
              const leftTopValue = leftTop.x + leftTop.y
              if (leftTopValue < leftTopMin) {
                leftTopMin = leftTopValue
                leftMostNode = node
              }
            }
            if (leftMostNode) {
              editorSharedDocument.deleteNodeInParent(
                leftMostNode.nodeId,
                leftMostNode.parentStructureInfo
                  ? getChildrenInStructTree(leftMostNode.parentStructureInfo)
                  : undefined
              )
            }
          })
        }
      }
    }
  }, [])

  const unsubscribeAll = useCallback(() => {
    downSubscription.current?.unsubscribe()
    duplicateSubscription.current?.unsubscribe()
  }, [])

  useEffect(() => {
    return () => unsubscribeAll()
  }, [unsubscribeAll])

  const handleMouseUp = useCallback<MouseEventHandler>(() => {
    unsubscribeAll()
  }, [unsubscribeAll])

  return (
    <EditorContainer
      ref={container}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <EditorContent zoom={zoom} />
      <EditorUpper zoom={zoom} />
      <EditorActionDetect />
    </EditorContainer>
  )
}
export default memo(GlazeEditor)
