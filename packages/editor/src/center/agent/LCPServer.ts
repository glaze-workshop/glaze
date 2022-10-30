import {
  LCPClientMessage,
  LCPMessageType,
  LCPServerController,
  LCPServerMessage,
  LCPSubscribeResponse
} from '@glaze/common'
import { v4 as UuidV4 } from 'uuid'

import { Log } from '../../utils'
import { LCPServerSubscribeInfo } from '../type'
import LCPConnection from './LCPConnection'

class LCPServer {
  private controller: LCPServerController
  private connections = 0
  private subscribeMap: Map<string, Set<LCPServerSubscribeInfo>> = new Map()

  constructor(controller: LCPServerController) {
    this.controller = controller
  }

  addConnection(connection: LCPConnection) {
    connection.onMessage((message) => {
      this.dispatchMessage(connection, message)
    })

    connection.onClose(() => {
      this.removeConnection(connection)
      this.connections--
      Log.server(`connection closed: ${this.connections}`, this.subscribeMap)
    })

    this.connections++
    Log.server(`add connections: ${this.connections}`)
  }

  removeConnection(connection: LCPConnection) {
    for (const subscribeSet of this.subscribeMap.values()) {
      for (const sub of [...subscribeSet]) {
        if (sub.connection === connection) {
          subscribeSet.delete(sub)
        }
      }
    }
  }

  /**
   * Dispatch message from connection
   * base on message type
   */
  private dispatchMessage(connection: LCPConnection, msg: LCPClientMessage) {
    Log.server('on message', msg)
    switch (msg.type) {
      case LCPMessageType.Request:
        this.handleRequest(connection, msg)
        break

      case LCPMessageType.Subscribe:
        this.handleSubscribe(connection, msg)
        break

      case LCPMessageType.UnSubscribe:
        this.handleUnsubscribe(connection, msg)
        break

      case LCPMessageType.Unknown:
      default:
        this.handleUnknownType(connection, msg)
        break
    }
  }

  /**
   * Send message wrapper
   *   for message type check: LCPServerMessage
   */
  private sendMessage<T>(connection: LCPConnection, msg: LCPServerMessage<T>) {
    connection.sendMessage(msg)
  }

  /**
   * Get response from controller and send back
   */
  private handleRequest(connection: LCPConnection, msg: LCPClientMessage) {
    const { uuid } = msg

    this.controller
      .handleRequest(msg)
      .then((data) => {
        this.sendMessage(connection, {
          uuid,
          seq: 0,
          success: true,
          data
        })
      })
      .catch((err) => {
        this.sendMessage(connection, {
          uuid,
          seq: 0,
          success: false,
          data: err
        })
      })
  }

  /**
   * Register relative info on subscribeMap
   * and send SubscribeResponse
   */
  private handleSubscribe(connection: LCPConnection, { path, uuid, params }: LCPClientMessage) {
    const subscribeSet = this.subscribeMap.get(path) || new Set()
    if (!this.subscribeMap.has(path)) {
      this.subscribeMap.set(path, subscribeSet)
    }

    const publishId = UuidV4()

    subscribeSet.add({
      connection,
      path,
      uuid: publishId,
      params,
      seq: 0
    })

    this.sendMessage<LCPSubscribeResponse>(connection, {
      uuid,
      seq: 0,
      success: true,
      data: {
        success: true,
        subscribeId: publishId
      }
    })

    Log.server('handleSubscribe: subscribeMap', this.subscribeMap)
  }

  /**
   * Remove subscribe register
   */
  private handleUnsubscribe(connection: LCPConnection, { path, uuid }: LCPClientMessage) {
    const subscribers = this.subscribeMap.get(path)
    if (!subscribers) {
      return
    }

    const matchSubscribers = []
    subscribers.forEach((subscribeInfo) => {
      if (subscribeInfo.connection === connection && subscribeInfo.uuid === uuid) {
        matchSubscribers.push(subscribeInfo)
      }
    })

    matchSubscribers.forEach((subscriber) => {
      subscribers.delete(subscriber)
    })
    Log.server('handleSubscribe: subscribeMap', this.subscribeMap)
  }

  /**
   * Unknown message type  => response success = false
   */
  private handleUnknownType(connection: LCPConnection, { type, uuid }: LCPClientMessage) {
    this.sendMessage(connection, {
      uuid,
      seq: 0,
      success: false,
      data: `Unknown request type: ${type}`
    })
  }

  publish<P>(path: string, data: any) {
    const subscribeSet = this.subscribeMap.get(path)
    if (subscribeSet) {
      subscribeSet.forEach((subscribeInfo) => {
        const { connection, uuid, seq } = subscribeInfo
        const nextSeq = seq + 1
        this.sendMessage(connection, {
          uuid,
          seq: nextSeq,
          success: true,
          data
        })

        subscribeInfo.seq = nextSeq // update seq
      })
    }
  }
}

export default LCPServer
