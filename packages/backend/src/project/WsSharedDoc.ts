import * as Y from 'yjs'
import * as encoding from 'lib0/encoding'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as ws from 'ws'
import type { DocService } from './doc.service'
import { EditorMessageEvent } from '@glaze/common'
import * as syncProtocol from 'y-protocols/sync'

export class WSSharedDoc extends Y.Doc {
  private readonly awarenessChannel: string
  private readonly clients: Map<ws.WebSocket, Set<number>> = new Map()
  public readonly awareness: awarenessProtocol.Awareness = new awarenessProtocol.Awareness(this)

  constructor (private readonly projectId: number, private readonly docService: DocService) {
    super()

    this.awarenessChannel = `${this.projectId}-awareness`

    this.awareness.on('update', this.awarenessChangeHandler)
    this.on('update', this.updateHandler)

    // sub.subscribe([this.id, this.awarenessChannel]).then(() => {
    //   sub.on('messageBuffer', (channel, update) => {
    //     const channelId = channel.toString()

    //     // update is a Buffer, Buffer is a subclass of Uint8Array, update can be applied
    //     // as an update directly

    //     if (channelId === this.id) {
    //       Y.applyUpdate(this, update, sub)
    //     } else if (channelId === this.awarenessChannel) {
    //       console.log('here')
    //       awarenessProtocol.applyAwarenessUpdate(this.awareness, update, sub)
    //     }
    //   })
    // })
  }

  private awarenessChangeHandler = ({ added, updated, removed }: {added: number[]; updated: number[]; removed: number[]}, origin: any) => {
    const changedClients = added.concat(updated, removed)
    const connControlledIds = this.clients.get(origin)
    if (connControlledIds) {
      added.forEach(clientId => { connControlledIds.add(clientId) })
      removed.forEach(clientId => { connControlledIds.delete(clientId) })
    }

    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, EditorMessageEvent.AWARENESS)
    encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
    const buff = encoding.toUint8Array(encoder)

    this.clients.forEach((_, c) => {
      this.send(c, buff)
    })
  }

  private updateHandler = async (update: Uint8Array, origin: 'database') => {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
    syncProtocol.writeUpdate(encoder, update)
    const buff = encoding.toUint8Array(encoder)

    this.clients.forEach((_, c) => {
      this.send(c, buff)
    })

    if (origin !== 'database') {
      await this.docService.persistUpdate(this.projectId, update)
    }
  }

  destroy () {
    super.destroy()
    // sub.unsubscribe(this.name)
  }

  send = (client: ws.WebSocket, message: Uint8Array) => {
    client.send(message, err => {
      err !== undefined && this.close(client)
    })
  }

  close = (client: ws.WebSocket) => {
    const controlledIds = this.clients.get(client)
    if (controlledIds) {
      this.clients.delete(client)
      awarenessProtocol.removeAwarenessStates(this.awareness, Array.from(controlledIds), null)

      if (this.clients.size === 0) {
        this.destroy()
        this.docService.removeDoc(this)
      }
    }

    client.close()
  }

  initClient (client: ws.WebSocket) {
    this.clients.set(client, new Set())
  }

  applyAwarenessUpdate (client: ws.WebSocket, update: Uint8Array) {
    return awarenessProtocol.applyAwarenessUpdate(this.awareness, update, client)
  }
}
