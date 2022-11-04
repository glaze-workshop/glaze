// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, ReactNode } from 'react'
import {
  BackgroundParam,
  backgroundToStyle,
  FontParam,
  fontToStyle,
} from '@glaze/types'

export interface GoodProps {
  children?: ReactNode
  background: BackgroundParam
  font: FontParam
}

const Good: FC<GoodProps> = ({ children, background, font }) => {
  return (
    <div
      style={{
        height: '100%',
        ...backgroundToStyle(background),
      }}
    >
      <div
        style={{
          backgroundColor: 'green',
          ...fontToStyle(font),
        }}
      >
        Very well done!
      </div>

      {children}
    </div>
  )
}

export default Good
