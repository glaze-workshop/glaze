/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets'
import * as ws from 'ws'
import { IncomingMessage } from 'http'
import { AuthService } from '../auth/auth.service'
import { decoding, encoding } from 'lib0'
import { EditorMessageEvent, GlazeErr } from '@glaze/common'
import BidirectionalMap from '../utils/BidirectionalMap'
import { Logger } from '@nestjs/common'

@WebSocketGateway({ path: '/ws-message' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private userMap = new BidirectionalMap<number, ws.WebSocket>()
  private readonly logger = new Logger(MessageGateway.name)

  constructor(private authService: AuthService) {}

  @SubscribeMessage(EditorMessageEvent.AUTH)
  async handleEvent(
    @MessageBody() decoder: decoding.Decoder,
    @ConnectedSocket() conn: ws.WebSocket
  ) {
    try {
      const token = decoding.readVarString(decoder)
      const user = await this.authService.verifyToken(
        token as string | undefined
      )
      this.userMap.set(user.id, conn)
    } catch (error) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.ERROR)
      encoding.writeVarUint(encoder, GlazeErr.ErrorCode.JwtAuthError)
      conn.send(encoding.toUint8Array(encoder))
    }
  }

  async sendMessageToUser(userId: number, message: string) {
    const conn = this.userMap.get(userId)
    if (conn) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, EditorMessageEvent.MESSAGE)
      encoding.writeVarString(encoder, message)
      conn.send(encoding.toUint8Array(encoder))
      this.logger.log(`Send message to user ${userId}: ${message}`)
    }
  }

  async handleConnection(client: ws.WebSocket, req: IncomingMessage) {
    client.binaryType = 'arraybuffer'
  }

  handleDisconnect(client: ws.WebSocket) {
    console.log('message User disconnected')
    this.userMap.deleteByValue(client)
  }

  afterInit(server: any) {
    console.log('message Socket is live')
  }
}
