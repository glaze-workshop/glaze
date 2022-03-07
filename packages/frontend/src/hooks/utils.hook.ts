import { useReducer } from 'react'

export function useForceRerender () {
  const [, forceRender] = useReducer((s: number) => s + 1, 0)
  return forceRender
}
