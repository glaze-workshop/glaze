import { FrameProps } from '.'
import { ComponentConfig, ControlType, LengthUnit } from '@glaze/types'
import { BasicComponentId } from '../basicComponentInfo'

const FrameConfig: ComponentConfig<FrameProps> = {
  id: BasicComponentId.Frame,
  name: 'Frame',
  props: {
    background: {
      name: '背景',
      type: ControlType.BACKGROUND,
      default: {
        backgroundColor: 'green'
      }
    }
  },
  defaultSize: {
    width: [LengthUnit.FIXED, 300],
    height: [LengthUnit.FIXED, 300]
  },
  hasChildren: true
}

export default FrameConfig
