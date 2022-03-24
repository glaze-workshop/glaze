import React, { FC } from 'react'

export interface ScreenProps {}

const GlazeScreen: FC<ScreenProps> = ({ children }) => {
  return (
    <div
      style={{
        height: '100%',
        background: 'gray'
      }}
    >
      {children}
    </div>
  )
}
export default GlazeScreen
