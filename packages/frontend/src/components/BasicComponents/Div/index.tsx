import React, { FC } from 'react'
import { GlazeComponentProps } from 'packages/frontend/src/schema/config'

export interface GlazeDivProps extends GlazeComponentProps {}

const GlazeDiv: FC<GlazeDivProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        opacity: 0.5,
        // color: 'green'
      }}
    >
      {children}
    </div>
  )
}

export default GlazeDiv
