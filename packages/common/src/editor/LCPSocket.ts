import { LCPSocketMessage } from '..'
import { tryParse, tryStringify } from '../utils/json'
import {
  HeartbeatTrigger,
  LCPServerMessage,
  LCPSocketOptions,
  LCPSocketState,
  LCPSocketSubscriber
} from './lcp.type'
import SimpleHeartbeatTrigger from './SimpleHeartbeatTrigger'

const LOG_PREFIX = '[LCPSocket]'

const Log = {
  log(...args: any[]) {
    console.log(LOG_PREFIX, ...args)
  },
  error(...args: any[]) {
    console.error(LOG_PREFIX, ...args)
  }
}

class LCPSocket {
  private url: string
  private heartbeat: false | HeartbeatTrigger
  private interval: number

  private ws: WebSocket
  private state: LCPSocketState = LCPSocketState.Closed
  private subscribers: Set<LCPSocketSubscriber> = new Set()
  private waitingTasks: (() => void)[] = []
  private heartbeatTimeout: number

  constructor({ url, heartbeat, heartbeatInterval }: LCPSocketOptions) {
    this.url = url

    this.setHeartbeat(heartbeat, heartbeatInterval)
    this.openWs()
  }

  private setHeartbeat(
    heartbeat: boolean | HeartbeatTrigger,
    heartbeatInterval?: number
  ) {
    if (heartbeat === true) {
      heartbeat = new SimpleHeartbeatTrigger()
    }

    this.heartbeat = heartbeat
    if (heartbeat) {
      this.interval = heartbeatInterval || 60 * 1000 // default 1 min
    } else {
      this.interval = Number.MAX_VALUE
    }
  }

  private nextHeartbeat() {
    if (this.heartbeat) {
      const data = this.heartbeat.next()

      const msg: LCPSocketMessage = { __heartbeat: data }
      this.sendMessage(msg)

      this.heartbeatTimeout = window.setTimeout(() => {
        // timeout
        Log.error('heartbeat timeout error, close immediately')
        this.close()
      }, 30 * 1000) // timeout in 30s
    }
  }

  private openWs() {
    if (this.state !== LCPSocketState.Closed) {
      // WebSocket already open
      return
    }
    const ws = (this.ws = new WebSocket(this.url))
    this.state = LCPSocketState.Create

    ws.addEventListener('open', (e) => {
      Log.log('[LCPSocket] on open', e)
      this.state = LCPSocketState.Ready
      this.flushTasks() // flush task pushed before Ready
    })

    ws.addEventListener('message', (e) => {
      try {
        const data: LCPSocketMessage = tryParse(e.data)
        Log.log('on message', data)

        /**
         * Dispatch message
         */

        if (data.__heartbeat) {
          /**
           * 1. heartbeat message
           */
          if (this.heartbeat) {
            const heartbeatValid = this.heartbeat.check(data.__heartbeat)
            if (heartbeatValid) {
              // clear timeout and send next
              Log.log('heartbeat check success, prepare next')

              clearTimeout(this.heartbeatTimeout) // clear timeout check
              this.heartbeatTimeout = window.setTimeout(() => {
                this.nextHeartbeat()
              }, this.interval)
            } else {
              // heartbeat check fail
              // => throw and open
              Log.error('heartbeat check fail, data:', data)
              this.close()
            }
          } else {
            // get heartbeat, but heartbeat = false
            // silence and do nothing
          }
        } else {
          /**
           * 2. client message
           */
          this.notify(data)
        }
      } catch (ex) {
        Log.error('on message error:', ex)
      }
    })

    ws.addEventListener('error', (e) => {
      Log.error('on error', e)
    })

    ws.addEventListener('close', (e) => {
      Log.log('on close', e)
      this.close()
    })

    // start heartbeat
    this.nextHeartbeat()
  }

  close() {
    clearTimeout(this.heartbeatTimeout) // clear either heartbeat request & timeout

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close()
    }

    this.state = LCPSocketState.Closed
  }

  private flushTasks() {
    this.waitingTasks.forEach((task) => {
      task()
    })
    this.waitingTasks = []
  }

  sendMessage(data: any) {
    const raw = tryStringify(data)

    // 1. Ready  => send immediately
    if (this.state === LCPSocketState.Ready) {
      this.ws.send(raw)
      return
    }

    // 2. Closed  => re-open
    if (this.state === LCPSocketState.Closed) {
      // re-open WebSocket connection
      this.close()
      this.openWs()
    }

    // 3. Create => push waiting task queue until opened
    this.waitingTasks.push(() => {
      this.ws.send(raw)
    })
  }

  /**
   * listen message
   * return unsubcribe function
   */
  onMessage(subscriber: LCPSocketSubscriber): () => void {
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

  private notify(data: any) {
    this.subscribers.forEach((subscriber) => {
      subscriber(data)
    })
  }
}

export default LCPSocket
