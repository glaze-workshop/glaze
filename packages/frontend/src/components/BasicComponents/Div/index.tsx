import React, { FC } from 'react'
import { GlazeComponentProps } from 'packages/frontend/src/schema/config'
import { Rnd } from 'react-rnd'

export interface GlazeDivProps extends GlazeComponentProps {}

const GlazeDiv: FC<GlazeDivProps> = ({ children }) => {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <div
        style={{
          height: '100%',
          backgroundColor: 'red'
        }}
      >
        {children}
      </div>
    </Rnd>
  )
}

export default GlazeDiv
