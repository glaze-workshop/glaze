import React, { FC } from 'react'
import { Route } from 'wouter'

export interface ScreenProps {
  path?: string
}
const GlazeScreen:FC<ScreenProps> = ({
  children,
  path = '/'
}) => {
  return <Route path={path}>{children}</Route>
}
export default GlazeScreen
