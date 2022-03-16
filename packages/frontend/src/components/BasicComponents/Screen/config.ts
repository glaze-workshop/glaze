import { LengthUnit } from '../../../schema/length'
import { ScreenProps } from '.'
import { ComponentConfig, ControlType } from '../../../schema/config'
import { BasicComponentId } from '../basicComponentInfo'

const ScreenConfig: ComponentConfig<ScreenProps> = {
  id: BasicComponentId.Screen,
  name: 'Screen',
  props: {
  },
  defaultSize: {
    width: [LengthUnit.FIXED, 375],
    height: [LengthUnit.FIXED, 800]
  },
  hasChildren: true
}

export default ScreenConfig