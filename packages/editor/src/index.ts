import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors'

import { PORT, RouterPrefix } from './config'
import { GlazeComponentConfig } from '@glaze/types'
import { GlazePath } from '@glaze/sdk-toolkit'
import { handleStartBuild, handleStartWatch, server } from './center'
import LCPConnection from './center/agent/LCPConnection'

export const handleComponentsWatch = (componentsConfigs: GlazeComponentConfig[]) => {
  componentsConfigs.map(handleStartWatch)
  const app = express()
  expressWs(app)

  app.use(cors())

  const wsRouter = express.Router()

  wsRouter.ws('/', (ws, req) => {
    const connection = new LCPConnection(ws)

    server.addConnection(connection)
  })
  /**
   * WebSocket Router
   */
  app.use(RouterPrefix.Ws, wsRouter)

  /**
   * (static) Component Resources
   */
  app.use(RouterPrefix.Component, express.static(GlazePath.componentDistPath))

  /**
   * Other http routes
   */
  app.get(RouterPrefix.Greeting, (req, res, next) => {
    res.send('Hello editor')
  })

  app.listen(PORT, () => {
    console.log(`Editor local server listen at http://localhost:${PORT}`)
  })
}

export const handleComponentsBuild = (componentsConfigs: GlazeComponentConfig[]) => {
  componentsConfigs.map(handleStartBuild)
}
