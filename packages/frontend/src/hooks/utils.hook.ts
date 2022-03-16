import { useEffect, useReducer, useState } from 'react'
import { BehaviorSubject } from 'rxjs'

export function useForceRerender () {
  const [, forceRender] = useReducer((s: number) => s + 1, 0)
  return forceRender
}

/**
 * Turn BehaviorSubject into React state
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
