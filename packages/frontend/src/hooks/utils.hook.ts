import { useCallback, useReducer, useRef } from 'react'

export function useForceRerender() {
  const [, forceRender] = useReducer((s: number) => s + 1, 0)
  return forceRender
}

/**
 * Expect baseState to be a React-state value
 * this hook create a shadow state for input-state
 * which will update when baseState change
 * also it can change itself without mutate baseState
 * either baseState or shadowState change will make Component re-render only for one time
 */
export const useShadowState = <T>(
  baseState: T,
  compare: (oldState: T, newState: T) => boolean = (v1, v2) => v1 === v2
): [T, (newValue: T) => void] => {
  // extends baseState
  const valRef = useRef(baseState)

  const lastbaseState = useRef(baseState)
  if (!compare(lastbaseState.current, baseState)) {
    // console.log('baseState change', lastbaseState.current, baseState)
    // when baseState change will only re-render because of setbaseState method
    lastbaseState.current = baseState
    // and override current value
    valRef.current = baseState
  }

  // only set shadowValue and don't change originState
  const forceUpdate = useForceRerender()
  const setVal = useCallback((newValue: T) => {
    // console.log('setVal', newValue, typeof newValue)
    valRef.current = newValue
    // only change shadowState and invoke re-render
    forceUpdate()
  }, [])

  return [valRef.current, setVal]
}
