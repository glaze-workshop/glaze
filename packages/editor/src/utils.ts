import debug from 'debug'
import { WebSocket } from 'ws'
import webpack from 'webpack'
import { cloneDeep } from 'lodash'

import webpackBaseConfig from '../webpack.config.base'
import { EditorWebSocketResponse } from './routers/type'

/**
 * Return JSON.parse result
 * or origin input otherwise
 */
export const tryParse = (s: string) => {
  try {
    return JSON.parse(s)
  } catch (e) {
    console.error(e)
    return s
  }
}

/**
 * Loggers create by debug
 */
export const Log = {
  ws: debug('router:ws'),
  center: debug('center'),
  webpack: debug('center:webpack'),
  monitor: debug('center:monitor')
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

export const getWebpackBaseConfig = (): webpack.Configuration => {
  // @ts-ignore
  return cloneDeep(webpackBaseConfig)
}
