import React, { FC } from 'react'

export interface FontControlProps {
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
}

export interface FontProps {
  content: string
  font?: FontControlProps
}

const Font: FC<FontProps> = ({ font, content }) => {
  return (
    <div
      style={{
        fontFamily: font?.fontFamily,
        fontWeight: font?.fontWeight,
        fontSize: `${font?.fontSize}px`,
        color: font?.color,
      }}
    >
      {content}
    </div>
  )
}

export default Font
