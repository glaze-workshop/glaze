import { debug } from 'debug'

enum LogPrefix {
  Editor = 'editor',
  EditorGesture = 'editor:gesture',
  EditorCustomSupport = 'editor:customSupport',
  Home = 'home'
}

export const Log = {
  EditorActionDetect: debug(`${LogPrefix.Editor}:actionDetect`),
  EditorKeyboardGesture: debug(`${LogPrefix.EditorGesture}:keyboard`),
  EditorCustomSupportHook: debug(`${LogPrefix.EditorCustomSupport}:Hook`),
  EditorCustomComponent: debug(`${LogPrefix.EditorCustomSupport}:customComponent`),
  HomeFolder: debug(`${LogPrefix.Home}:folder`)
}

/**
 * Set DEBUG in browser
 */
// localStorage.debug = `${LogPrefix.EditorCustomSupport}*`
localStorage.removeItem('debug') // clear log key
