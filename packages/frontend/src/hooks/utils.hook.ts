import { useCallback, useEffect, useReducer, useState } from 'react'
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
