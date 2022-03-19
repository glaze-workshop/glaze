import { useEffect, useRef } from 'react'
import { getToken } from '../utils/token'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import { EditorMessageEvent, GlazeErr } from '@glaze/common'
import { useMatch } from 'react-router-dom'
import { queryClient } from '../utils/queryClient'
import { useQueryClient } from 'react-query'

export function useWebSocketMessage () {
  const matchLogin = useMatch('/login')
  const matchRegister = useMatch('/register')
  const enableWebSocket = !matchLogin && !matchRegister

  const queryClient = useQueryClient()

  const client = useRef<WebSocket>()

  useEffect(() => {
    if (enableWebSocket) {
      client.current = new WebSocket('ws://localhost:3000/ws-message')
      client.current.binaryType = 'arraybuffer'
      client.current.onopen = () => {
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, EditorMessageEvent.AUTH)
        const token = getToken()
        encoding.writeVarString(encoder, token)
        client.current?.send(encoding.toUint8Array(encoder))
      }

      function handleError (decoder: decoding.Decoder) {
        const errorCode = decoding.readVarUint(decoder)
        if (errorCode === GlazeErr.ErrorCode.JwtAuthError) {
          location.href = '/login?redirect=' + encodeURIComponent(location.href)
        }
      }

      function handleRefreshMessage (decoder: decoding.Decoder) {
        const message = decoding.readVarString(decoder)
        queryClient.refetchQueries(message)
      }

      client.current.onmessage = (event) => {
        const decoder = decoding.createDecoder(new Uint8Array(event.data))
        const eventType = decoding.readVarUint(decoder)
        switch (eventType) {
          case EditorMessageEvent.ERROR:
            handleError(decoder)
            break
          case EditorMessageEvent.MESSAGE:
            handleRefreshMessage(decoder)
            break
        }
      }
    }

    return () => {
      client.current?.close()
    }
  }, [enableWebSocket, queryClient])
}
