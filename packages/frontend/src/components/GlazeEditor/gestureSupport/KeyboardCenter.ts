import { emptyFn } from '../../../utils/null'
import { Log } from '../../../utils/log'

import {
  KeyboardCenterTargetOption,
  KeyboardCenterEvent,
  KeyboardCenterSubscriber
} from './keyboard.type'
import { KeyboardCenterCallback, KeyboardCenterTarget } from '.'

/**
 * Build event target base on options
 */
export const keyboardEventTarget = ({
  key,
  altKey,
  ctrlKey,
  shiftKey,
  metaKey
}: KeyboardCenterTargetOption) => {
  let target = key.toLowerCase()
  altKey && (target = `alt-${target}`)
  ctrlKey && (target = `ctrl-${target}`)
  shiftKey && (target = `shift-${target}`)
  metaKey && (target = `meta-${target}`)
  return target
}

export class KeyboardCenter {
  private subscribersMap: Map<
    KeyboardCenterTarget,
    Set<KeyboardCenterSubscriber>
  > = new Map() // target => { target, callback }

  isListening = false
  private teardown = emptyFn

  /**
   * 开始监听
   */
  setup() {
    Log.EditorKeyboardGesture('KeyboardCenter setup')

    const onKeydown = (e: KeyboardEvent) => {
      const target = keyboardEventTarget(e)

      // 触发主事件
      this.emit(target, e)

      // Delete 事件再触发
      if (['Delete', 'Backspace'].includes(target)) {
        this.emit(KeyboardCenterEvent.Delete, e)
      }
    }
    const onCopy = (e: ClipboardEvent) => {
      this.emit(KeyboardCenterEvent.Copy, e)
    }
    const onPaste = (e: ClipboardEvent) => {
      this.emit(KeyboardCenterEvent.Paste, e)
    }

    document.addEventListener('copy', onCopy)
    document.addEventListener('paste', onPaste)
    document.addEventListener('keydown', onKeydown)

    this.isListening = true
    this.teardown = () => {
      Log.EditorKeyboardGesture('KeyboardCenter teardown')

      document.removeEventListener('copy', onCopy)
      document.removeEventListener('paste', onPaste)
      document.removeEventListener('keydown', onKeydown)
    }
  }

  /**
   * 销毁监听函数
   */
  destroy() {
    this.teardown()
    this.teardown = emptyFn
    this.isListening = false
  }

  /**
   * 监听事件
   */
  subscribe(
    option: KeyboardCenterTarget | KeyboardCenterTargetOption,
    callback: KeyboardCenterCallback
  ): () => void {
    Log.EditorKeyboardGesture('subscribe', option)

    const target =
      typeof option === 'string' ? option : keyboardEventTarget(option)

    const subscribers = this.subscribersMap.get(target) || new Set()
    if (!this.subscribersMap.has(target)) {
      this.subscribersMap.set(target, subscribers)
    }

    const receiver = {
      target,
      callback
    }
    subscribers.add(receiver)

    let unsubscribed = false
    return () => {
      if (unsubscribed) {
        return
      }

      subscribers.delete(receiver)
      unsubscribed = true
    }
  }

  /**
   * 触发事件
   */
  private emit(
    target: KeyboardCenterTarget,
    e: KeyboardEvent | ClipboardEvent
  ) {
    Log.EditorKeyboardGesture('emit', target, e)

    const subscribers = this.subscribersMap.get(target)
    if (subscribers) {
      subscribers.forEach((subscriber) => {
        subscriber.callback(target, e)
      })
    }
  }
}

/**
 * Global Instance of KeyboardCenter
 * or you can just new your own one by using KeyboardCenter class
 */
export const keyboardCenter = new KeyboardCenter()
