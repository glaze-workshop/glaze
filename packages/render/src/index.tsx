import React, { FC } from 'react'
import { BasicComponentId } from './BasicComponents'
import GlazeNodeWrapper from './GlazeNodeWrapper'
import { Switch } from 'wouter'
import { registerEvents } from './event'

import 'normalize.css'
import 'systemjs'
import { useNodeListener } from './state'
import { createRoot } from 'react-dom/client'

registerEvents()

System.set('app:react', { default: React, __useDefault: true })

const App: FC = () => {
  useNodeListener()

  return (
    <Switch>
      {window.GLAZE_STRUCTURE.map((structure) => {
        const node = window.GLAZE_NODES[structure.nodeId]
        if (node.componentId === BasicComponentId.Screen) {
          return (
            <GlazeNodeWrapper
              key={structure.nodeId}
              nodeInfo={node}
              structureInfo={structure}
              enableLayout={false}
            />
          )
        }
        return <></>
      })}
    </Switch>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
