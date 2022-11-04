import { FC } from 'react'
import { FontParam, fontToStyle } from '@glaze/types'

export interface FontProps {
  content: string
  font: FontParam
}

const Font: FC<FontProps> = ({ content, font }) => {
  return (
    <div
      style={{
        height: '100%',
        ...fontToStyle(font),
      }}
    >
      {content}
    </div>
  )
}

export default Font
