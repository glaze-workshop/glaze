/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { EditorMessageEvent, GlazeErr, notEmpty, ProjectApi } from '@glaze/common'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket
} from '@nestjs/websockets'
import { IncomingMessage } from 'http'
import * as ws from 'ws'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as syncProtocol from 'y-protocols/sync'
import qs from 'query-string'
import { DocService } from './doc.service'
import { AuthService } from '../auth/auth.service'

@WebSocketGateway(3000, { path: '/ws-doc' })
export class DocGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private clientProjectIdMap = new Map<ws.WebSocket, number>()

  constructor(
    private docService: DocService,
    private authService: AuthService
  ) {}

  @SubscribeMessage(EditorMessageEvent.SYNC)
  async handleSyncMessage(
    @MessageBody() decoder: decoding.Decoder,
    @ConnectedSocket() conn: ws.WebSocket
  ) {
    const projectId = this.clientProjectIdMap.get(conn)
    if (projectId !== undefined) {
      const doc = await this.docService.getDocByProjectId(projectId)
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.SYNC)
      syncProtocol.readSyncMessage(decoder, encoder, doc.doc, null)
      if (encoding.length(encoder) > 1) {
        doc.send(conn, encoding.toUint8Array(encoder))
      }
    }
  }

  @SubscribeMessage(EditorMessageEvent.AWARENESS)
  async handleAwarenessMessage(
    @MessageBody() decoder: decoding.Decoder,
    @ConnectedSocket() conn: ws.WebSocket
  ) {
    const projectId = this.clientProjectIdMap.get(conn)
    if (projectId !== undefined) {
      const doc = await this.docService.getDocByProjectId(projectId)
      doc.applyAwarenessUpdate(decoding.readVarUint8Array(decoder), conn)
    }
  }

  @SubscribeMessage(EditorMessageEvent.AUTH)
  async handleAuth(
    @MessageBody() decoder: decoding.Decoder,
    @ConnectedSocket() conn: ws.WebSocket
  ) {
    try {
      const token = decoding.readVarString(decoder)
      const user = await this.authService.verifyToken(token)
      const projectId = this.clientProjectIdMap.get(conn)
      if (notEmpty(projectId)) {
        const project = await this.docService.checkUserInProject(
          projectId,
          user.id
        )
        if (project) {
          const encoder = encoding.createEncoder()
          encoding.writeVarUint(encoder, EditorMessageEvent.AUTH_SUCCESS)
          conn.send(encoding.toUint8Array(encoder))
          return
        }
      }
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.ERROR)
      encoding.writeVarUint(encoder, GlazeErr.ErrorCode.PermissionDeniedError)
      conn.send(encoding.toUint8Array(encoder))
    } catch (error) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.ERROR)
      encoding.writeVarUint(encoder, GlazeErr.ErrorCode.JwtAuthError)
      conn.send(encoding.toUint8Array(encoder))
    }
  }

  async handleConnection(client: ws.WebSocket, req: IncomingMessage) {
    client.binaryType = 'arraybuffer'

    if (req.url) {
      const res = qs.parseUrl(req.url)

      if (res.query.projectId) {
        const projectId = Number(res.query.projectId)
        console.log('User connected', projectId)
        this.clientProjectIdMap.set(client, projectId)
        const doc = await this.docService.getDocByProjectId(projectId)
        doc.initClient(client)
      }
    }
  }

  handleDisconnect(client: ws.WebSocket) {
    const projectId = this.clientProjectIdMap.get(client)
    if (projectId !== undefined) {
      this.docService.closeClientByProjectId(projectId, client)
      this.clientProjectIdMap.delete(client)
    }
    console.log('User disconnected', projectId)
  }

  afterInit(server: ws.WebSocket) {
    console.log('Socket is live')
  }
}
