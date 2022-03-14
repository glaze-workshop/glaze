import React, { FC } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Routes } from 'react-router-dom'
import { BasicComponentId } from './BasicComponents'
import GlazeNodeWrapper from './GlazeNodeWrapper'

const App:FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {window.GLAZE_STRUCTURE.map(structure => {
          const node = window.GLAZE_NODES[structure.nodeId]
          if (node.componentId === BasicComponentId.Screen) {
            return (
              <GlazeNodeWrapper key={structure.nodeId} nodeInfo={node} structureInfo={structure} enableLayout={false} />
            )
          }
          return <></>
        })}
      </Routes>
    </BrowserRouter>
  )
}

render(<App />, document.getElementById('root'))
