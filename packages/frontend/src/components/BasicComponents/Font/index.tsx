import { FontControlProps, GlazeComponentProps } from 'packages/frontend/src/schema/config'
import { FC } from 'react'

export interface FontProps extends GlazeComponentProps {
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
        color: font?.color
      }}
    >
      {content}
    </div>
  )
}

export default Font
