import React from 'react'
import { ComponentConfig } from '../../schema/config'
import Font from './Font'
import FontConfig from './Font/config'
import Frame from './Frame'
import FrameConfig from './Frame/config'
import GlazeScreen from './Screen'
import ScreenConfig from './Screen/config'
import GlazeDiv from './Div'
import GlazeDivConfig from './Div/config'

export interface ComponentFullInfo {
  config: ComponentConfig
  component: React.FunctionComponent<any>
}

export const createBasicComponentMap = (): Map<string, ComponentFullInfo> =>
  new Map([
    [FontConfig.id, { config: FontConfig, component: Font }],
    [FrameConfig.id, { config: FrameConfig, component: Frame }],
    [ScreenConfig.id, { config: ScreenConfig, component: GlazeScreen }],
    [GlazeDivConfig.id, { config: GlazeDivConfig, component: GlazeDiv }]
  ])
