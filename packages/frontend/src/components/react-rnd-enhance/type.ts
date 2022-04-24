import { MouseEvent } from 'react'

type TUpdateHandle = (id: string, ref: HTMLElement, x: number, y: number) => any

type TPosition = {
  x: number
  y: number
}

type TSize = {
  width: number | string
  height: number | string
}

export { TUpdateHandle, TPosition, TSize }

export enum DragType {
  MouseDown = 'mousedown',
  MouseMove = 'mousemove',
  MouseUp = 'mouseup'
}

export interface DragCallbackProps {
  type: DragType
  x: number // e.clientX
  y: number // e.clientY
  deltaX: number
  deltaY: number
}

export interface DragCallback {
  (e: MouseEvent, props: DragCallbackProps): void
}
