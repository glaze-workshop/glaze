import { ScreenProps } from '.'
import { ComponentConfig, ControlType, LengthUnit } from '@glaze/types'

import { BasicComponentId } from '../basicComponentInfo'

const ScreenConfig: ComponentConfig<ScreenProps> = {
  id: BasicComponentId.Screen,
  name: 'Screen',
  props: {
    background: {
      name: '背景',
      type: ControlType.BACKGROUND,
      default: {
        backgroundColor: 'gray'
      }
    }
  },
  defaultSize: {
    width: [LengthUnit.FIXED, 875],
    height: [LengthUnit.FIXED, 800]
  },
  hasChildren: true,
  path: 'default_Screen_Path',
  to: 'default_Screen_To'
}

export default ScreenConfig
