import { LCPClient, LCPSocket } from '@glaze/common'

let client: LCPClient | null = null

export const getEditorClient = (): LCPClient => {
  if (client) {
    return client
  }

  // init once
  return (client = new LCPClient(
    new LCPSocket({ url: 'ws://localhost:8999/ws', heartbeat: true })
  ))
}
