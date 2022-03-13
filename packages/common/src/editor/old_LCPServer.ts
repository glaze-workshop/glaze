import { WebSocket } from 'ws'
import {
  LCPClientMessage,
  LCPMessageType,
  LCPServerController,
  LCPServerMessage
} from './lcp.type'

interface SubscribeInfo {
  connection: WebSocket
  uuid: string
  params?: any
  seq: number
}

class LCPServer {
  private controller: LCPServerController
  private connections: Set<WebSocket> = new Set()
  private subscribeMap: Map<string, Set<SubscribeInfo>> = new Map()

  constructor(controller: LCPServerController) {
    this.controller = controller
  }

  addConnection(ws: WebSocket) {
    this.connections.add(ws)

    ws.on('message', (raw: string) => {
      const msg = JSON.parse(raw) as LCPClientMessage

      switch (msg.type) {
        case LCPMessageType.Request:
          this.handleRequest(ws, msg)
          break

        case LCPMessageType.Subscribe:
          this.handleSubscribe(ws, msg)
          break

        case LCPMessageType.UnSubscribe:
          this.handleUnSubscribe(ws, msg)
          break
      }
    })

    ws.on('error', () => {
      this.removeConnection(ws)
    })

    ws.on('close', () => {
      this.removeConnection(ws)
    })
  }

  private handleRequest<T>(connection: WebSocket, msg: LCPClientMessage) {
    this.controller.handleRequest<T>(msg).then((data) => {
      const responseMsg: LCPServerMessage<T> = {
        uuid: msg.uuid,
        seq: 1,
        success: true,
        data
      }

      const raw = JSON.stringify(responseMsg)
      connection.send(raw)
    })
  }

  private handleSubscribe(
    connection: WebSocket,
    { uuid, path, params }: LCPClientMessage
  ) {
    const set: Set<SubscribeInfo> = this.subscribeMap.get(path) || new Set()
    if (!this.subscribeMap.has(path)) {
      this.subscribeMap.set(path, set)
    }
    set.add({
      connection,
      uuid,
      params,
      seq: 0
    })
  }

  private handleUnSubscribe(connection: WebSocket, msg: LCPClientMessage) {}

  removeConnection(ws: WebSocket) {
    this.connections.delete(ws)
  }

  /**
   * Publish data to all match Subscribers
   */
  publish<T = any>(route: string, data: T) {
    if (this.subscribeMap.has(route)) {
      console.log(`publish ${route}`)
      const subscribeSet = this.subscribeMap.get(route)

      subscribeSet?.forEach((info) => {
        const { connection, uuid, seq } = info

        const nextSeq = (info.seq = seq + 1)
        const response: LCPServerMessage = {
          uuid,
          seq: nextSeq,
          success: true,
          data
        }
        const raw = JSON.stringify(response)
        connection.send(raw)
      })
    }
  }

  /**
   * Broadcast message to all connections
   */
  broadcast<T>(msg: LCPServerMessage<T>) {}
}

export default LCPServer
