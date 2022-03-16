import styled from '@emotion/styled'
import { Point, Transform, Zoom } from '@glaze/zoom'
import normalizeWheel from 'normalize-wheel'
import React, { FC, memo, useEffect, useRef } from 'react'
import EditorContent from './EditorContent'
import EditorUpper from './EditorUpper'
import { EditorPositionSubject, useProjectIdChange } from './state'

export const zoom = new Zoom()

export interface GlazeEditorProps {

}

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const GlazeEditor:FC<GlazeEditorProps> = () => {
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
          const k = zoom.transform.k * Math.pow(2, 0.001 * -e.pixelY)
          const { x = 0, y = 0 } = EditorPositionSubject.value ?? {}
          const p: Point = { x: event.clientX - x, y: event.clientY - y }
          zoom.scaleBy(k, p)
        } else if (event.shiftKey) {
          zoom.scrollX(e.pixelY * 0.3)
        } else {
          zoom.scrollY(e.pixelY * 0.3)
        }
      }
      el.addEventListener('wheel', onWheel)
      return () => {
        el.removeEventListener('wheel', onWheel)
      }
    }
  }, [])

  return (
    <EditorContainer ref={container}>
      <EditorContent zoom={zoom} />
      <EditorUpper zoom={zoom} />
    </EditorContainer>
  )
}
export default memo(GlazeEditor)
