/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage, MessageBody, ConnectedSocket
} from '@nestjs/websockets'
import * as ws from 'ws'
import { IncomingMessage } from 'http'
import { AuthService } from '../auth/auth.service'
import { decoding, encoding } from 'lib0'
import { EditorMessageEvent, GlazeErr } from '@glaze/common'

@WebSocketGateway({ path: '/ws-message' })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private userMap = new Map<number, ws.WebSocket>()

  constructor (private authService: AuthService) {}

  @SubscribeMessage(EditorMessageEvent.AUTH)
  async handleEvent (@MessageBody() decoder: decoding.Decoder, @ConnectedSocket() conn: ws.WebSocket) {
    try {
      const token = decoding.readVarString(decoder)
      const user = await this.authService.verifyToken(token as string | undefined)
      this.userMap.set(user.id, conn)
    } catch (error) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.ERROR)
      encoding.writeVarUint(encoder, GlazeErr.ErrorCode.JwtAuthError)
    }
  }

  async handleConnection (client: ws.WebSocket, req: IncomingMessage) {
    client.binaryType = 'arraybuffer'
  }

  handleDisconnect (client: any) {
    console.log('message User disconnected')
  }

  afterInit (server: any) {
    console.log('message Socket is live')
  }
}
