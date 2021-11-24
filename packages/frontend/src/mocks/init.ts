if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./browser')
  worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  })
}
