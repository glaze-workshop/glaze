import React, { FC, useState, useMemo } from 'react'
import { GlazeComponentProps } from 'packages/frontend/src/schema/config'
import { Rnd } from 'react-rnd'
import { nanoid } from 'nanoid'
import { ReactRndEnhance } from '../../react-rnd-enhance'
import { TUpdateHandle } from '../../react-rnd-enhance/type'

export interface GlazeDivProps extends GlazeComponentProps {}

const GlazeDiv: FC<GlazeDivProps> = ({ children }) => {
  const [nodes, setNodes] = useState([
    {
      id: nanoid(),
      position: {
        x: 0,
        y: 0
      },
      size: {
        width: 50,
        height: 50
      },
      bgColor: 'green',
      name: '元素A'
    }
  ])

  const dragUpdate: TUpdateHandle = (id, ref, x, y) => {
    setNodes((pre) => [
      ...pre.filter((node) => node.id !== id),
      { ...pre.filter((node) => node.id === id)[0], position: { x, y } }
    ])
  }

  const resizeUpdate: TUpdateHandle = (id, ref, x, y) => {
    setNodes((pre) => [
      ...pre.filter((node) => node.id !== id),
      {
        ...pre.filter((node) => node.id === id)[0],
        position: { x, y },
        size: {
          width: ref.getBoundingClientRect().width,
          height: ref.getBoundingClientRect().height
        }
      }
    ])
  }

  const content = useMemo(() => {
    return (
      <>
        {nodes.map((node) => (
          <ReactRndEnhance
            key={node.id}
            id={node.id}
            position={node.position}
            size={node.size}
            dragUpdate={dragUpdate}
            resizeUpdate={resizeUpdate}
            // bounds={'parent'}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.5,
                backgroundColor: node.bgColor
              }}
            >
              {node.name}
            </div>
          </ReactRndEnhance>
        ))}
      </>
    )
  }, [nodes])

  return <>{content}</>
}

export default GlazeDiv
