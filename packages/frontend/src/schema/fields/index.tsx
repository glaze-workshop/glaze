import React, { ReactElement } from 'react'
import { icons, IconEnum } from '../../pages/project/components/LeftBar/icon'
import GBCfields from './GlazeBasicComponents'
import { DragPanel } from '../../pages/project/components/LeftBar/DragPanel'

export interface menusProps {
  key: string
  icon: keyof typeof icons
  panel: ReactElement
}

export const menus: menusProps[] = [
  {
    key: 'GBC',
    icon: IconEnum.HTML5,
    panel: <DragPanel fields={GBCfields} />
  }
]
