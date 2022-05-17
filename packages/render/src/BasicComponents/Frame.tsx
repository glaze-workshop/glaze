import React, { FC } from 'react'

export interface BackgroundControlProps {
  backgroundColor?: string
  backgroundImage?: string
}
export interface FrameProps {
  background?: BackgroundControlProps
}

const Frame: FC<FrameProps> = ({ children, background }) => {
  return (
    <div
      style={{
        height: '100%',
        backgroundColor: background?.backgroundColor || 'green',
        backgroundImage: background?.backgroundImage
          ? `url("${background?.backgroundImage}")`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  )
}
export default Frame
