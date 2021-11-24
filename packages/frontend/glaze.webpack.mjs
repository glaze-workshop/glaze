/** @type {import('@glaze/bundler').WebpackCustomConfig} */
const glazeConfig = {
  port: 8888,
  proxy: {
    '/api': {
      target: 'http://localhost:3000'
    }
  }
}

export default glazeConfig
