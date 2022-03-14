import { FC } from 'react'
import Screen from './Screen'
import Frame from './Frame'
import Font from './Font'

export enum BasicComponentId {
  Screen = '@glaze-component/screen',
  Frame = '@glaze-component/frame',
  Font = '@glaze-component/font',
}

export const BasicComponents: Record<string, FC<any>> = {
  [BasicComponentId.Screen]: Screen,
  [BasicComponentId.Frame]: Frame,
  [BasicComponentId.Font]: Font
}
