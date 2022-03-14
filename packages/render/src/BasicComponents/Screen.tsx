import React, { FC } from 'react'
import { Route } from 'react-router-dom'

export interface ScreenProps {
  path?: string
}
const GlazeScreen:FC<ScreenProps> = ({
  children,
  path = '/'
}) => {
  return <Route path={path} element={children}/>
}
export default GlazeScreen
