import React, { FC } from 'react'

export interface FontProps {
  content: string
}

const Font:FC<FontProps> = ({ content }) => {
  return <div>{content}</div>
}

export default Font
