import React, { ReactElement } from 'react'
import { icons, IconEnum } from '../../pages/project/components/LeftBar/icon'
import GBCfields from './GlazeBasicComponents'

export interface menuProps {
  key: string
  icon: keyof typeof icons
  panel: ReactElement
}

// const menu: menuProps[] = [
//   {
//     key: 'basicGBC',
//     icon: IconEnum.HTML5,
//     panel: 
//   }
// ]
