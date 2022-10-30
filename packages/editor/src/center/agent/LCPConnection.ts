import { WebSocket } from 'ws'
import { HeartbeatHandler, LCPSocketSubscriber, LCPSocketMessage } from '@glaze/common'

import { Log, tryParse, tryStringify } from '../../utils'
import SimpleHeartbeatHandler from './SimpleHeartbeatHandler'

class LCPConnection {
  private ws: WebSocket
  private heartbeatHandler: HeartbeatHandler
  private subscribers: Set<LCPSocketSubscriber> = new Set()
  private closeCallback: Set<() => void> = new Set()

  constructor (ws: WebSocket, handler?: HeartbeatHandler) {
    this.ws = ws
    this.heartbeatHandler = handler || new SimpleHeartbeatHandler()

    // start listening
    this.setup()
  }

  private setup () {
    const ws = this.ws

    ws.on('message', (s: string) => {
      const data = tryParse(s)
      Log.connection('on message', data)

      if ((data as LCPSocketMessage).__heartbeat) {
        // handle heartbeat
        const res = this.heartbeatHandler.handleNext((data as LCPSocketMessage).__heartbeat)
        const resMessage: LCPSocketMessage = { __heartbeat: res }
        this.sendMessage(resMessage)
      } else {
        // handle message
        this.subscribers.forEach((subscriber) => subscriber(data))
      }
    })

    ws.on('error', (e) => {
      Log.connection('on error', e)
    })

    ws.on('close', () => {
      // notify callbacks
      this.closeCallback.forEach((cb) => cb())
    })
  }

  sendMessage (data: any) {
    Log.connection('sendMessage', data)
    const raw = tryStringify(data)

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(raw)
    } else {
      Log.connection('send to closed connection', this.ws.url, data)
    }
  }

  onMessage (subscriber: LCPSocketSubscriber): () => void {
    this.subscribers.add(subscriber)

    let unsubscribed = false
    return () => {
      if (unsubscribed) {
        return
      }

      this.subscribers.delete(subscriber)
      unsubscribed = true
    }
  }

  onClose (cb: () => void) {
    this.closeCallback.add(cb)
  }

  close () {
    this.ws.close()
  }
}

export default LCPConnection
