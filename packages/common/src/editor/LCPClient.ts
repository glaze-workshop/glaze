import { v4 as UuidV4 } from 'uuid'

import {
  LCPClientMessage,
  LCPMessageType,
  LCPServerMessage,
  LCPSubscribeResponse,
  LCPClientOptions,
  LCPClientReceiver
} from './lcp.type'
import LCPSocket from './LCPSocket'

const LOG_PREFIX = '[LCPClient]'

const Log = {
  log(...args: any[]) {
    // console.log(LOG_PREFIX, ...args)
  },
  error(...args: any[]) {
    console.error(LOG_PREFIX, ...args)
  }
}

const REQUEST_TIMEOUT = 60 * 1000 // request timeout in 1min

class LCPClient {
  private socket: LCPSocket
  private requestMap: Map<string, LCPClientReceiver> = new Map()
  private subscribeCount: number = 0

  constructor(options: LCPClientOptions | LCPSocket) {
    this.socket = options instanceof LCPSocket ? options : options.socket

    this.socket.onMessage((data) => {
      this.dispatchMessage(data)
    })

    this.socket.onClose((reopen) => {
      if (this.subscribeCount > 0 && !reopen) {
        setTimeout(() => {
          this.socket.open()
          this.requestMap.forEach(({ retry }) => {
            retry()
          })
        }, 3 * 1000) // reopen in 2s
      }
    })
  }

  private dispatchMessage({ uuid, seq, success, data }: LCPServerMessage) {
    if (this.requestMap.has(uuid)) {
      this.requestMap.get(uuid)?.response(success, data)
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

      this.requestMap.set(reqId, {
        retry: () => {
          this.socket.sendMessage(message)
        },
        response: (success, data) => {
          clearTimeout(timeout)
          this.requestMap.delete(reqId)

          success ? resolve(data) : reject(data)
        }
      })
    })
  }

  /**
   * Internal request but ignore response
   */
  private _send(message: LCPClientMessage): void {
    this.socket.sendMessage(message)
  }

  /**
   * Send Request
   * return Promise with single Response
   */
  request<T = any>(path: string, params?: any): Promise<T> {
    Log.log(`Request ${path}`)
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
    Log.log(`Subscribe ${path}`)
    return this._request<LCPSubscribeResponse>({
      type: LCPMessageType.Subscribe,
      path,
      uuid: UuidV4(),
      params
    }).then(({ success, subscribeId }) => {
      if (success) {
        Log.log(`Subscribe ${path} success: ${subscribeId}`)
        // start listening
        this.requestMap.set(subscribeId, {
          retry: () => {
            unsubscribe()
            this.subscribe(path, params, onUpdate)
          },
          response: (_ /* ignore internal success */, data: T) => {
            Log.log(`on Subscribe ${path}`, data)
            onUpdate(data)
          }
        })
        this.subscribeCount++

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
          this.subscribeCount--
          unsubscribed = true
        }

        return unsubscribe
      } else {
        return Promise.reject(new Error('Subscribe reject'))
      }
    })
  }
}

export default LCPClient
