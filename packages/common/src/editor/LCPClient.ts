import { v4 as UuidV4 } from 'uuid'
import {
  LCPClientMessage,
  LCPMessageType,
  LCPServerMessage,
  LCPSubscribeResponse
} from '..'

import { LCPClientOptions, LCPClientReceiver } from './lcp.type'
import LCPSocket from './LCPSocket'

const LOG_PREFIX = '[LCPClient]'

const Log = {
  log(...args: any[]) {
    console.log(LOG_PREFIX, ...args)
  },
  error(...args: any[]) {
    console.error(LOG_PREFIX, ...args)
  }
}

const REQUEST_TIMEOUT = 60 * 1000 // request timeout in 1min

class LCPClient {
  private socket: LCPSocket
  private requestMap: Map<string, LCPClientReceiver> = new Map()

  constructor(options: LCPClientOptions | LCPSocket) {
    this.socket = options instanceof LCPSocket ? options : options.socket

    this.socket.onMessage((data) => {
      this.dispatchMessage(data)
    })
  }

  private dispatchMessage({ uuid, seq, success, data }: LCPServerMessage) {
    if (this.requestMap.has(uuid)) {
      this.requestMap.get(uuid)?.(success, data)
    } else {
      Log.error(`No match request: ${uuid}-${seq}`, data)
    }
  }

  /**
   * Internal request
   *   success => resolve
   *   response fail => reject
   *   timeout => reject
   */
  private _request<T = any>(message: LCPClientMessage): Promise<T> {
    const reqId = message.uuid
    this.socket.sendMessage(message)

    // response
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        Log.error(`request timeout: ${reqId}`, message)
        this.requestMap.delete(reqId)

        reject(new Error('Request timeout'))
      }, REQUEST_TIMEOUT)

      this.requestMap.set(reqId, (success, data) => {
        clearTimeout(timeout)
        this.requestMap.delete(reqId)

        success ? resolve(data) : reject(data)
      })
    })
  }

  /**
   * Internal request but ignore response
   */
  private _send<T = any>(message: LCPClientMessage): void {
    this.socket.sendMessage(message)
  }

  /**
   * Send Request
   * return Promise with single Response
   */
  request<T = any>(path: string, params?: any): Promise<T> {
    return this._request({
      type: LCPMessageType.Request,
      path,
      uuid: UuidV4(),
      params
    })
  }

  /**
   * Subscirbe target
   * return unsubscribe method
   */
  subscribe<T>(
    path: string,
    params: any = undefined,
    onUpdate: (data: T) => void
  ): Promise<() => void> {
    return new Promise((resolve) => {
      this._request<LCPSubscribeResponse>({
        type: LCPMessageType.Subscribe,
        path,
        uuid: UuidV4(),
        params
      }).then(({ success, subscribeId }) => {
        if (success) {
          // start listening
          this.requestMap.set(
            subscribeId,
            (_ /* ignore internal success */, data: T) => {
              onUpdate(data)
            }
          )

          // unsubscribe method
          let unsubscribed = false
          const unsubscribe = () => {
            if (unsubscribed) {
              return
            }

            this._send({
              type: LCPMessageType.UnSubscribe,
              path,
              uuid: subscribeId
            })

            this.requestMap.delete(subscribeId)
            unsubscribed = true
          }

          resolve(unsubscribe)
        } else {
          return Promise.reject(new Error('Subscribe reject'))
        }
      })
    })
  }
}

export default LCPClient
