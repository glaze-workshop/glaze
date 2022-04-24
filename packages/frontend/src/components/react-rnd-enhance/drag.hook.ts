import { MouseEvent, MutableRefObject, useCallback, useRef } from 'react'

import { DragCallback, DragType } from './type'

export const useDrag = (ref: MutableRefObject<HTMLElement | null>, cb: DragCallback) => {
  const cbRef = useRef(cb)
  cbRef.current = cb

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault()

    const { clientX: x0, clientY: y0 } = e
    console.log('start drag', x0, y0)

    cbRef.current(e, { type: DragType.MouseDown, x: x0, y: y0, deltaX: 0, deltaY: 0 })

    const calcProps = (e: MouseEvent) => {
      const { clientX: x1, clientY: y1 } = e
      const [deltaX, deltaY] = [x1 - x0, y1 - y0]
      return { x: x1, y: y1, deltaX, deltaY }
    }

    if (ref.current) {
      const el = ref.current

      const onMouseMove = (e: MouseEvent) => {
        const props = calcProps(e)
        cbRef.current(e, { type: DragType.MouseMove, ...props })
      }

      const onMouseUp = (e: MouseEvent) => {
        const props = calcProps(e)
        cbRef.current(e, { type: DragType.MouseUp, ...props })

        // @ts-ignore
        el.removeEventListener('mousemove', onMouseMove)
        // @ts-ignore
        el.removeEventListener('mouseup', onMouseUp)
      }

      // @ts-ignore
      el.addEventListener('mousemove', onMouseMove)
      // @ts-ignore
      el.addEventListener('mouseup', onMouseUp)
    }
  }, [])

  return onMouseDown
}
