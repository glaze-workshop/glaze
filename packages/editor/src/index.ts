import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors'
import path from 'path'

import { PORT, RouterPrefix } from './config'

const app = express()
const { app: appWs } = expressWs(app)

app.use(cors())

/**
 * WebSocket Router
 */
app.use(RouterPrefix.Ws, require('./routers/ws').default)

/**
 * (static) Component Resources
 */
app.use(RouterPrefix.Component, express.static(path.join(__dirname, '../lib/')))

/**
 * Other http routes
 */
app.get(RouterPrefix.Greeting, (req, res, next) => {
  res.send('Hello editor')
})

app.listen(PORT, () => {
  console.log(`Editor local server listen at http://localhost:${PORT}`)
})
