import React, { FC } from 'react'

export interface FrameProps {}

const Frame: FC<FrameProps> = ({ children }) => {
  return (
    <div
      style={{
        height: '100%',
        background: 'green'
      }}
    >
      {children}
    </div>
  )
}
export default Frame
