import { FC, ReactNode } from 'react'
import { Route } from 'wouter'
import { BackgroundParam, backgroundToStyle } from '@glaze/types'

export interface ScreenProps {
  path?: string
  children?: ReactNode
  background: BackgroundParam
}
const GlazeScreen: FC<ScreenProps> = ({ children, path = '/', background }) => {
  return (
    <Route path={path}>
      <div
        style={{
          height: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...backgroundToStyle(background),
        }}
      >
        {children}
      </div>
    </Route>
  )
}
export default GlazeScreen
