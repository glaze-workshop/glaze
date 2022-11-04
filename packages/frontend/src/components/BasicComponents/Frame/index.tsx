import { FC, ReactNode } from 'react'
import { BackgroundParam, backgroundToStyle } from '@glaze/types'

export interface FrameProps {
  children?: ReactNode
  background: BackgroundParam
}

const Frame: FC<FrameProps> = ({ children, background }) => {
  return (
    <div
      style={{
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...backgroundToStyle(background)
      }}
    >
      {children}
    </div>
  )
}
export default Frame
