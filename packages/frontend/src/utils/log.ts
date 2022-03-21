import { debug } from 'debug'

enum LogPrefix {
  Editor = 'editor',
  EditorGesture = 'editor:gesture',
  EditorCustomSupport = 'editor:customSupport'
}

export const Log = {
  EditorActionDetect: debug(`${LogPrefix.Editor}:actionDetect`),
  EditorKeyboardGesture: debug(`${LogPrefix.EditorGesture}:keyboard`),
  EditorCustomSupportHook: debug(`${LogPrefix.EditorCustomSupport}:Hook`),
  EditorCustomComponent: debug(
    `${LogPrefix.EditorCustomSupport}:customComponent`
  )
}

/**
 * Set DEBUG in browser
 */
// localStorage.debug = `${LogPrefix.Editor}*`
// localStorage.debug = `${LogPrefix.EditorCustomSupport}*`
localStorage.debug = ''
