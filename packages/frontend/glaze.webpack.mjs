/** @type {import('@glaze/bundler').WebpackCustomConfig} */
const glazeConfig = {
  port: 8888,
  proxy: {
    '/api': {
      target: 'http://localhost:3000'
    },
    '/ws-doc': {
      target: 'ws://localhost:3000',
      ws: true
    }
  }
}

export default glazeConfig
