import { FontParam, fontToStyle } from '@glaze/types'
import { FC } from 'react'

export interface FontProps {
  content: string
  font: FontParam
}

const Font: FC<FontProps> = ({ content, font }) => {
  return (
    <div
      style={{
        height: '100%',
        ...fontToStyle(font)
      }}
    >
      {content}
    </div>
  )
}

export default Font
