// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, ReactNode } from 'react'

export interface ShadowProps {
  children?: ReactNode
  background?: string
}

const Shadow: FC<ShadowProps> = ({ children, background = '#212121' }) => {
  return (
    <div
      style={{
        height: '100%',
        background,
        borderRadius: '1000px',
      }}
    >
      你好
      {children}
    </div>
  )
}

export default Shadow
