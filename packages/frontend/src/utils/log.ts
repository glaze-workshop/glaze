import { debug } from 'debug'

enum LogPrefix {
  Editor = 'editor',
  EditorGesture = 'editor:gesture'
}

export const Log = {
  EditorActionDetect: debug(`${LogPrefix.Editor}:actionDetect`),
  EditorKeyboardGesture: debug(`${LogPrefix.EditorGesture}:keyboard`)
}

/**
 * Set DEBUG in browser
 */
// localStorage.debug = `${LogPrefix.Editor}*`
localStorage.debug = `${LogPrefix.Editor}:actionDetect`
