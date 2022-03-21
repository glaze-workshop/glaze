import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react'
import { BehaviorSubject } from 'rxjs'

export function useForceRerender() {
  const [, forceRender] = useReducer((s: number) => s + 1, 0)
  return forceRender
}

/**
 * useState for BehaviorSubject
 * ex:
 *   ```ts
 *   const [value, setValue] = useBehaviorSubjectState(valueSubject)
 *   ```
 */
export const useBehaviorSubjectState = <T>(
  subject: BehaviorSubject<T>
): [T, (nextValue: T) => void] => {
  const [value, setValue] = useState(subject.value)

  /**
   * Subscribe Updating
   */
  useEffect(() => {
    const subscriber = subject.subscribe((value) => {
      setValue(value)
    })
    return () => {
      subscriber.unsubscribe()
    }
  }, [subject])

  /**
   * Setter
   */
  const setSubject = useCallback(
    (nextValue: T) => {
      subject.next(nextValue)
    },
    [subject]
  )

  return [value, setSubject]
}

/**
 * state for BehaviorSubject
 * ex:
 *   ```ts
 *   const value = useBehaviorSubjectValue(valueSubject)
 *   ```
 */
export const useBehaviorSubjectValue = <T>(subject: BehaviorSubject<T>): T => {
  const [value, setValue] = useState(subject.value)

  useEffect(() => {
    const subscriber = subject.subscribe((value) => {
      setValue(value)
    })
    return () => {
      subscriber.unsubscribe()
    }
  }, [subject])

  return value
}

/**
 * setState for BehaviorSubject
 * ex:
 *   ```ts
 *   const setValue = useSetBehaviorSubjectState(valueSubject)
 *   ```
 */
export const useSetBehaviorSubjectState = <T>(
  subject: BehaviorSubject<T>
): ((nextValue: T) => void) => {
  const setSubject = useCallback(
    (nextValue: T) => {
      subject.next(nextValue)
    },
    [subject]
  )

  return setSubject
}

/**
 * Turn state into ref:
 *   Caught newest state value and assign to ref.current
 */
export const useStateRef = <T>(state: T): MutableRefObject<T> => {
  const ref = useRef<T>(state)
  ref.current = state
  return ref
}

/**
 * Expect baseState to be a React-state value
 * this hook create a shadow state for input-state
 * which will update when baseState change
 * also it can change itself without mutate baseState
 * either baseState or shadowState change will make Component re-render only for one time
 *
 * promise:
 *   setVal always return same reference
 */
export const useShadowState = <T>(
  baseState: T,
  compare: (oldState: T, newState: T) => boolean = (v1, v2) => v1 === v2
): [T, (newValue: T) => void] => {
  // extends baseState
  const valRef = useRef(baseState)

  const lastbaseState = useRef(baseState)
  if (!compare(lastbaseState.current, baseState)) {
    // when baseState change will only re-render because of setbaseState method
    lastbaseState.current = baseState
    // and override current value
    valRef.current = baseState
  }

  // only set shadowValue and don't change originState
  const forceUpdate = useForceRerender()
  const setVal = useCallback((newValue: T) => {
    valRef.current = newValue
    // only change shadowState and invoke re-render
    forceUpdate()
  }, [])

  return [valRef.current, setVal]
}

type UseShadowInputResult = [
  string,
  (e: ChangeEvent<HTMLInputElement>) => void,
  {
    resetInput: () => void
  }
]

export const useShadowInput = (
  baseState: string,
  compare: (oldState: string, newState: string) => boolean = (v1, v2) => v1 === v2
): UseShadowInputResult => {
  const [input, setInput] = useShadowState(baseState, compare)

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const resetInput = useCallback(() => {
    setInput(baseState)
  }, [baseState])

  return [input, onInputChange, { resetInput }]
}
