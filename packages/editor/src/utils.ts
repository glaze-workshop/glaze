import debug from 'debug'
import { WebSocket } from 'ws'

import { EditorWebSocketResponse } from './routers/type'

export const tryParse = (s: string): any => {
  try {
    return JSON.parse(s)
  } catch (e) {
    console.log('tryParse fail', e)
    return null
  }
}

export const tryStringify = (data: any): string => {
  try {
    return JSON.stringify(data)
  } catch (e) {
    console.log('tryStringify fail', e)
    return ''
  }
}

/**
 * Loggers create by debug
 */
export const Log = {
  ws: debug('router:ws'),
  center: debug('center'),
  webpack: debug('center:webpack'),
  monitor: debug('center:monitor'),
  components: debug('center:components'),
  connection: debug('lcp:connection'),
  server: debug('lcp:server')
}

/**
 * wrap response by stringify
 */
export const sendMessage = (ws: WebSocket, response: EditorWebSocketResponse): boolean => {
  try {
    const raw = JSON.stringify(response)
    ws.send(raw)
    return true
  } catch (e) {
    return false
  }
}
