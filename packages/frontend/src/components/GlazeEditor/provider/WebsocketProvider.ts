/*
Unlike stated in the LICENSE file, it is not necessary to include the copyright notice and permission notice when you copy code from this file.
*/

/**
 * @module provider/websocket
 */

/* eslint-env browser */

import * as Y from 'yjs'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as syncProtocol from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'
import { EditorMessageEvent, Entity, GlazeErr } from '@glaze/common'
import { Point } from '@glaze/zoom'
import { BehaviorSubject, Subject } from 'rxjs'
import ColorHash from 'color-hash'
import { getToken } from '../../../utils/token'
const colorHash = new ColorHash()

export interface GlazeAwarenessState {
  userInfo?: Entity.UserEntity
  cursor?: Point
  selectedNodeId?: string | null
  clientId?: number
  color?: string
}

export class WebSocketProvider {
  url: string
  room: string
  doc: Y.Doc
  awareness: awarenessProtocol.Awareness
  readonly awarenessSubject = new BehaviorSubject<GlazeAwarenessState[]>([])

  ws?: WebSocket | null

  private resyncInterval: number

  constructor(
    serverUrl: string,
    room: string,
    doc: Y.Doc,
    awarenessListener: Subject<GlazeAwarenessState[]>,
    resyncInterval = 5000
  ) {
    this.url = serverUrl
    this.room = room
    this.doc = doc
    this.awareness = new awarenessProtocol.Awareness(doc)
    this.awarenessSubject.subscribe(awarenessListener)
    this.resyncInterval = 0
    if (resyncInterval > 0) {
      this.resyncInterval = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          // resend sync step 1
          const encoder = this.createEncoder()
          encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
          syncProtocol.writeSyncStep1(encoder, doc)
          this.ws.send(encoding.toUint8Array(encoder))
        }
      }, resyncInterval) as unknown as number
    }

    this.doc.on('update', this.updateHandler)

    window.addEventListener('beforeunload', this.beforeUnloadHandler)

    this.awareness.on('update', this.awarenessUpdateHandler)
    this.connect()
  }

  public destroy() {
    if (this.resyncInterval !== 0) {
      clearInterval(this.resyncInterval)
    }
    this.disconnect()
    window.removeEventListener('beforeunload', this.beforeUnloadHandler)

    this.awarenessSubject.unsubscribe()
    this.awareness.off('update', this.awarenessUpdateHandler)
    this.doc.off('update', this.updateHandler)
  }

  public disconnect() {
    this.ws?.close()
  }

  private connect = () => {
    const websocket = new WebSocket(this.url)
    websocket.binaryType = 'arraybuffer'
    this.ws = websocket

    websocket.onmessage = (event) => {
      const encoder = this.readMessage(new Uint8Array(event.data))
      if (encoding.length(encoder) > 1) {
        this.broadcastMessage(encoding.toUint8Array(encoder))
      }
    }
    websocket.onerror = (e) => {
      console.log('websocket dead', e)
    }

    websocket.onclose = (e) => {
      console.log('websocket closed', e)
      this.ws = null
      // update awareness (all users except local left)
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        Array.from(this.awareness.getStates().keys()).filter(
          (client) => client !== this.doc.clientID
        ),
        this
      )
    }
    websocket.onopen = (e) => {
      console.log('websocket open now', e)
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.AUTH)
      const token = getToken()
      encoding.writeVarString(encoder, token)
      websocket?.send(encoding.toUint8Array(encoder))
    }
  }

  private broadcastMessage = (buf: ArrayBuffer) => {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws?.send(buf)
    }
  }

  private createEncoder = () => {
    const encoder = encoding.createEncoder()
    // encoding.writeVarInt(encoder, GlazeWsEvent.WsEvent.SYNC)
    // encoding.writeVarString(encoder, this.room)
    return encoder
  }

  private readMessage = (buf: Uint8Array) => {
    const decoder = decoding.createDecoder(buf)
    const encoder = this.createEncoder()
    const messageType = decoding.readVarUint(decoder)

    const syncHandler = () => {
      encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
      syncProtocol.readSyncMessage(decoder, encoder, this.doc, this)
    }
    const awarenessHandler = () => {
      awarenessProtocol.applyAwarenessUpdate(
        this.awareness,
        decoding.readVarUint8Array(decoder),
        'websocket'
      )
    }

    const authSuccessHandler = () => {
      // always send sync step 1 when connected
      const encoder = this.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
      syncProtocol.writeSyncStep1(encoder, this.doc)
      this.broadcastMessage(encoding.toUint8Array(encoder))
      // broadcast local awareness state
      if (this.awareness.getLocalState() !== null) {
        const encoderAwarenessState = this.createEncoder()
        encoding.writeVarUint(encoderAwarenessState, EditorMessageEvent.AWARENESS)
        encoding.writeVarUint8Array(
          encoderAwarenessState,
          awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID])
        )
        this.broadcastMessage(encoding.toUint8Array(encoderAwarenessState))
      }
    }

    const errorHandler = () => {
      const errorCode = decoding.readVarUint(decoder)
      if (errorCode === GlazeErr.ErrorCode.JwtAuthError) {
        location.href = '/login?redirect=' + encodeURIComponent(location.href)
      } else if (errorCode === GlazeErr.ErrorCode.PermissionDeniedError) {
        alert('无此文档权限')
      }
    }

    switch (messageType) {
      case EditorMessageEvent.SYNC:
        syncHandler()
        break
      case EditorMessageEvent.AWARENESS:
        awarenessHandler()
        break
      case EditorMessageEvent.AUTH_SUCCESS:
        authSuccessHandler()
        break
      case EditorMessageEvent.ERROR:
        errorHandler()
        break
      default:
        console.error('Unable to compute message')
    }

    return encoder
  }

  private beforeUnloadHandler = () => {
    awarenessProtocol.removeAwarenessStates(this.awareness, [this.doc.clientID], 'window unload')
  }

  private updateHandler = (update: Uint8Array, origin: any) => {
    if (origin !== this) {
      const encoder = this.createEncoder()

      encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
      syncProtocol.writeUpdate(encoder, update)
      this.broadcastMessage(encoding.toUint8Array(encoder))
    }
  }

  /**
   * @param {any} changed
   * @param {any} origin
   */
  private awarenessUpdateHandler = ({ added, updated, removed }: any, origin: any) => {
    const changedClients = added.concat(updated).concat(removed)
    const encoder = this.createEncoder()
    encoding.writeVarUint(encoder, EditorMessageEvent.AWARENESS)
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
    )
    this.broadcastMessage(encoding.toUint8Array(encoder))

    const allStateMap = this.awareness.getStates()
    const allStateExceptSelf = Array.from(allStateMap.entries())
      .filter(([client]) => client !== this.doc.clientID)
      .flatMap(([clientId, state]) => ({
        color: colorHash.hex(String(clientId)),
        clientId,
        ...state
      }))

    this.awarenessSubject.next(allStateExceptSelf)
  }

  public setAwarenessUserState = (state: GlazeAwarenessState) => {
    this.awareness.setLocalState(state)
  }
}
