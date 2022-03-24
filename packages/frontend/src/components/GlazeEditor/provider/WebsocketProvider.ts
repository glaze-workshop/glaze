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
import { EditorMessageEvent } from '@glaze/common'

export class WebSocketProvider {
  url: string
  room: string
  doc: Y.Doc
  awareness: awarenessProtocol.Awareness

  ws?: WebSocket | null

  #resyncInterval: number

  constructor(serverUrl: string, room: string, doc: Y.Doc, resyncInterval = -1) {
    this.url = serverUrl
    console.log(this.url)
    this.room = room
    this.doc = doc
    this.awareness = new awarenessProtocol.Awareness(doc)
    this.#resyncInterval = 0
    if (resyncInterval > 0) {
      this.#resyncInterval = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          // resend sync step 1
          const encoder = this.createEncoder()
          encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
          syncProtocol.writeSyncStep1(encoder, doc)
          this.ws.send(encoding.toUint8Array(encoder))
        }
      }, resyncInterval) as unknown as number
    }

    this.doc.on('update', this.#updateHandler)

    window.addEventListener('beforeunload', this.#beforeUnloadHandler)

    this.awareness.on('update', this.#awarenessUpdateHandler)
    this.connect()
  }

  destroy() {
    if (this.#resyncInterval !== 0) {
      clearInterval(this.#resyncInterval)
    }
    this.disconnect()
    window.removeEventListener('beforeunload', this.#beforeUnloadHandler)

    this.awareness.off('update', this.#awarenessUpdateHandler)
    this.doc.off('update', this.#updateHandler)
  }

  disconnect() {
    this.ws?.close()
  }

  connect = () => {
    const websocket = new WebSocket(this.url)
    websocket.binaryType = 'arraybuffer'
    this.ws = websocket

    websocket.onmessage = (event) => {
      const encoder = this.readMessage(new Uint8Array(event.data))
      if (encoding.length(encoder) > 1) {
        websocket.send(encoding.toUint8Array(encoder))
      }
    }

    websocket.onclose = () => {
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
    websocket.onopen = () => {
      // always send sync step 1 when connected
      const encoder = this.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
      syncProtocol.writeSyncStep1(encoder, this.doc)
      websocket.send(encoding.toUint8Array(encoder))
      // broadcast local awareness state
      if (this.awareness.getLocalState() !== null) {
        const encoderAwarenessState = this.createEncoder()
        encoding.writeVarUint(encoderAwarenessState, EditorMessageEvent.AWARENESS)
        encoding.writeVarUint8Array(
          encoderAwarenessState,
          awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID])
        )
        websocket.send(encoding.toUint8Array(encoderAwarenessState))
      }
    }
  }

  broadcastMessage = (buf: ArrayBuffer) => {
    this.ws?.send(buf)
  }

  createEncoder = () => {
    const encoder = encoding.createEncoder()
    // encoding.writeVarInt(encoder, GlazeWsEvent.WsEvent.SYNC)
    // encoding.writeVarString(encoder, this.room)
    return encoder
  }

  readMessage = (buf: Uint8Array) => {
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
        this
      )
    }

    switch (messageType) {
      case EditorMessageEvent.SYNC:
        syncHandler()
        break
      case EditorMessageEvent.AWARENESS:
        awarenessHandler()
        break
      default:
        console.error('Unable to compute message')
    }

    return encoder
  }

  #beforeUnloadHandler = () => {
    awarenessProtocol.removeAwarenessStates(this.awareness, [this.doc.clientID], 'window unload')
  }

  #updateHandler = (update: Uint8Array, origin: any) => {
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
  #awarenessUpdateHandler = ({ added, updated, removed }: any, origin: any) => {
    const changedClients = added.concat(updated).concat(removed)
    const encoder = this.createEncoder()
    encoding.writeVarUint(encoder, EditorMessageEvent.AWARENESS)
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
    )
    this.broadcastMessage(encoding.toUint8Array(encoder))
  }
}
