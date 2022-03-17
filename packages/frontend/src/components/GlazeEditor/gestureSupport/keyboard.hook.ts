import { useEffect, useMemo } from 'react'
import { KeyboardCenterTarget } from '.'

import { useStateRef } from '../../../hooks/utils.hook'
import {
  KeyboardCenterCallback,
  KeyboardCenterTargetOption
} from './keyboard.type'
import { keyboardEventTarget, keyboardCenter } from './KeyboardCenter'

/**
 * 生命周期内启动全局的 keyboardCenter
 */
export const useKeyboardCenter = (center = keyboardCenter) => {
  useEffect(() => {
    if (!center.isListening) {
      center.setup()
      return () => {
        center.destroy()
      }
    }
  }, [center])
}

/**
 * 监听键盘事件
 *   默认注册在全局的 keyboardCenter 上
 * ex:
 *   ```ts
 *   useKeyboardDetect(KeyboardCenterEvent.Copy, (target, event) => {})
 *   useKeyboardDetect('c', (target, event) => {})
 *   useKeyboardDetect({
 *     key: 'c',
 *     shiftKey: true
 *   }, (target, event) => {})
 *   ```
 */
export const useKeyboardDetect = (
  options:
    | (KeyboardCenterTarget | KeyboardCenterTargetOption)
    | (KeyboardCenterTarget | KeyboardCenterTargetOption)[],
  cb: KeyboardCenterCallback,
  center = keyboardCenter
) => {
  const targets = useMemo(() => {
    const originArr = Array.isArray(options) ? options : [options]

    const targets = originArr.map((option) =>
      typeof option === 'string' ? option : keyboardEventTarget(option)
    )

    return targets
  }, [options])

  const cbRef = useStateRef(cb)

  useEffect(() => {
    const unsubscribeList = targets.map((target) => {
      const unsubscribe = center.subscribe(target, (target, e) => {
        cbRef.current(target, e)
      })
      return unsubscribe
    })

    return () => {
      unsubscribeList.forEach((unsubscribe) => {
        unsubscribe()
      })
    }
  }, [center, targets.join('.')])
}
