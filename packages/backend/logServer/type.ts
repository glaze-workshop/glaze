
export interface Log {
  level: string
  ts: number
  logger: string
  msg: string
  request: Request
  common_log: string
  user_id: string
  duration: number
  size: number
  status: number
  resp_headers: RespHeaders
}

export interface Request {
  remote_addr: string
  proto: string
  method: string
  host: string
  uri: string
  headers: { [key: string]: string[] }
  tls: TLS
}

export interface TLS {
  resumed: boolean
  version: number
  cipher_suite: number
  proto: string
  proto_mutual: boolean
  server_name: string
}

export interface RespHeaders {
  Server: string[]
  'Access-Control-Allow-Origin': string[]
  'Content-Type': string[]
  'Content-Encoding': string[]
  Date: string[]
  Vary: string[]
}
