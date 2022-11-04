import { FC, ReactNode } from 'react'
import { BackgroundParam, backgroundToStyle } from '@glaze/types'

export interface ScreenProps {
  children?: ReactNode
  background: BackgroundParam
}

const GlazeScreen: FC<ScreenProps> = ({ children, background }) => {
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
export default GlazeScreen
