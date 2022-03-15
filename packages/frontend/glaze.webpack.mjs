/** @type {import('@glaze/bundler').WebpackCustomConfig} */
const glazeConfig = {
  port: 8888,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000'
    },
    '/ws-doc': {
      target: 'ws://127.0.0.1:3000',
      ws: true
    }
  }
}

export default glazeConfig
