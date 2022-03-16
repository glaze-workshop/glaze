import LCPSocket from './LCPSocket'

// ========== Heartbeat ==========
export interface HeartbeatTrigger<T = any, R = any> {
  next(): T
  check(data: R): boolean
}

export interface HeartbeatHandler<T = any, R = any> {
  handleNext(data: T): R
}

// ========== LCPSocket ==========
export enum LCPSocketState {
  Create = 'LCP_SOCKET_CREATE',
  Ready = 'LCP_SOCKET_READY',
  Closed = 'LCP_SOCKET_CLOSED'
}

export interface LCPSocketOptions {
  url: string
  heartbeat: boolean | HeartbeatTrigger
  heartbeatInterval?: number
}

export interface LCPSocketSubscriber {
  (data: any): void
}

export interface LCPSocketMessage {
  __heartbeat?: any
}

// ========== common ==========
export enum LCPMessageType {
  Request = 'LCP_MESSAGE_REQUEST',
  Subscribe = 'LCP_MESSAGE_SUBSCRIBE',
  UnSubscribe = 'LCP_MESSAGE_UNSUBSCRIBE',
  Unknown = 'LCP_MESSAGE_UNKNOWN'
}

// ========== LCPClient ==========
export interface LCPClientOptions {
  socket: LCPSocket
}

export interface LCPClientMessage<P = any> {
  type: LCPMessageType // request type
  path: P | string // request target
  uuid: string // reqId
  params?: any
}

export interface LCPClientReceiver {
  retry: () => void
  response: (success: boolean, data: any) => any
}

export interface LCPSubscribeResponse {
  success: boolean
  subscribeId: string
}

// ========== LCPServer ==========
export interface LCPServerMessage<T = any> {
  uuid: string
  seq?: number
  success: boolean
  data: T
}

export interface LCPServerController {
  handleRequest(clientMessage: LCPClientMessage): Promise<any>
}
