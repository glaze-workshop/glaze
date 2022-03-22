import { Log } from './type'

export const example: Log = {
  level: 'info',
  ts: 1647333774.9767566,
  logger: 'http.log.access.log0',
  msg: 'handled request',
  request: {
    remote_addr: '[::1]:56179',
    proto: 'HTTP/2.0',
    method: 'GET',
    host: '3.preview.localhost',
    uri: '/favicon.ico',
    headers: {
      'Sec-Ch-Ua': [
        '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"'
      ],
      Accept: [
        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      ],
      'Sec-Fetch-Site': [
        'same-origin'
      ],
      'Cache-Control': [
        'no-cache'
      ],
      'Sec-Ch-Ua-Mobile': [
        '?0'
      ],
      'User-Agent': [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
      ],
      'Sec-Ch-Ua-Platform': [
        '"Windows"'
      ],
      'Sec-Fetch-Mode': [
        'no-cors'
      ],
      'Sec-Fetch-Dest': [
        'image'
      ],
      Referer: [
        'https://3.preview.localhost/'
      ],
      'Accept-Encoding': [
        'gzip, deflate, br'
      ],
      Pragma: [
        'no-cache'
      ],
      'Accept-Language': [
        'zh-CN,zh;q=0.9,en;q=0.8'
      ]
    },
    tls: {
      resumed: false,
      version: 772,
      cipher_suite: 4865,
      proto: 'h2',
      proto_mutual: true,
      server_name: '3.preview.localhost'
    }
  },
  common_log: '::1 - - [15/Mar/2022:16:42:54 +0800] "GET /favicon.ico HTTP/2.0" 200 1680',
  user_id: '',
  duration: 0.0704664,
  size: 1680,
  status: 200,
  resp_headers: {
    Server: [
      'Caddy'
    ],
    'Access-Control-Allow-Origin': [
      '*'
    ],
    'Content-Type': [
      'text/html; charset=utf-8'
    ],
    'Content-Encoding': [
      'gzip'
    ],
    Date: [
      'Tue, 15 Mar 2022 08:42:54 GMT'
    ],
    Vary: [
      'Origin',
      'Accept-Encoding'
    ]
  }
}
