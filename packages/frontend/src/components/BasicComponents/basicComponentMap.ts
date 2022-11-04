import React from 'react'
import { ComponentConfig } from '@glaze/types'
import Font from './Font'
import FontConfig from './Font/config'
import Frame from './Frame'
import FrameConfig from './Frame/config'
import GlazeScreen from './Screen'
import ScreenConfig from './Screen/config'

export enum ComponentType {
  BUILTIN = 'builtin',
  CUSTOM = 'custom',
  SHARED = 'shared'
}

export interface ComponentFullInfo {
  config: ComponentConfig
  component: React.FunctionComponent<any>
  type?: ComponentType
  unsubscribe?: () => void
}

export const createBasicComponentMap = (): Map<string, ComponentFullInfo> =>
  new Map([
    [FontConfig.id, { config: FontConfig, component: Font, type: ComponentType.BUILTIN }],
    [FrameConfig.id, { config: FrameConfig, component: Frame, type: ComponentType.BUILTIN }],
    [ScreenConfig.id, { config: ScreenConfig, component: GlazeScreen, type: ComponentType.BUILTIN }]
  ])
