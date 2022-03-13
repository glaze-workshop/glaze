import express from 'express'

import LCPConnection from '../center/LCPConnection'
import { server } from '../center'

const wsRouter = express.Router()

wsRouter.ws('/', (ws, req) => {
  const connection = new LCPConnection(ws)

  server.addConnection(connection)
})

export default wsRouter
