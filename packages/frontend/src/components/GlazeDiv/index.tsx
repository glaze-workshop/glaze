import React, { FC } from 'react'

export interface GlazeDivProps {
  props: any
}

export const GlazeDiv: FC<GlazeDivProps> = ({ props, children }) => {
  return <div {...props}>{children}</div>
}
