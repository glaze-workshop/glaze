import express from 'express'
import { WebSocket } from 'ws'

import center from '../center'
import { Log, sendMessage, tryParse } from '../utils'
import { EditorWebSocketRequest, EditorWebSocketRequestType, EditorWebSocketResponseType } from './type'

const wsRouter = express.Router()

wsRouter.ws('/', (ws, req) => {
  Log.ws('new connection ...')
  center.addConnection(ws)

  Log.ws('check center', center.check())

  /**
   * check & close connection when error/close event
   */
  const checkState = (): boolean => {
    const isAlive = ws.readyState === WebSocket.OPEN
    Log.ws(`checkState: ${ws.readyState}, isAlive: ${isAlive}`, center.check())

    if (!isAlive) {
      center.removeConnection(ws)
      ws.close()
    }

    return isAlive
  }

  /**
   * open / close / error
   */
  ws.on('error', (err) => {
    Log.ws('on error', err)
    checkState()
  })

  ws.on('close', (code, reason) => {
    Log.ws(`on close, code: ${code}`, reason)
    checkState()
  })

  /**
   * parse request control
   */
  ws.on('message', (raw: string) => {
    const req: EditorWebSocketRequest = tryParse(raw)
    Log.ws('on message', req)

    switch (req.type) {
      /**
       * 查询当前组件列表
       */
      case EditorWebSocketRequestType.GetComponentList:
        sendMessage(ws, {
          type: EditorWebSocketResponseType.Data,
          data: center.getComponentList()
        })
        break

      /**
       * 创建新组件
       */
      case EditorWebSocketRequestType.CreateComponent: {
        const success = center.createComponent(req.componentName as string)
        sendMessage(ws, {
          type: EditorWebSocketResponseType.Data,
          data: {
            success
          }
        })
        break
      }

      /**
       * 删除组件
       */
      case EditorWebSocketRequestType.RemoveComponent: {
        const success = center.removeComponent(req.componentName as string)
        sendMessage(ws, {
          type: EditorWebSocketResponseType.Data,
          data: {
            success
          }
        })
        break
      }

      default:
        sendMessage(ws, {
          type: EditorWebSocketResponseType.RequestTypeNotFound
        })
        break
    }
  })
})

export default wsRouter
