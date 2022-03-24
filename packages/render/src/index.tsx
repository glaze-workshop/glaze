import { FC } from 'react'
import { render } from 'react-dom'
import { BasicComponentId } from './BasicComponents'
import GlazeNodeWrapper from './GlazeNodeWrapper'
import { Switch } from 'wouter'
import { registerEvents } from './event'

import 'normalize.css'
import { useNodeListener } from './state'

registerEvents()

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

render(<App />, document.getElementById('root'))
