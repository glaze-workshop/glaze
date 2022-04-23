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
