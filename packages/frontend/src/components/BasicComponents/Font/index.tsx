import { GlazeComponentProps } from 'packages/frontend/src/schema/config'
import React, { FC } from 'react'

export interface FontProps extends GlazeComponentProps {
  content: string
}

const Font:FC<FontProps> = ({ style, className, content }) => {
  return <div className={className} style={style}>{content}</div>
}

export default Font
