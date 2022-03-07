import { LengthUnit } from '../../../schema/length'
import { FrameProps } from '.'
import { ComponentConfig, ControlType } from '../../../schema/config'
import { BasicComponentId } from '../basicComponentInfo'

const FrameConfig: ComponentConfig<FrameProps> = {
  id: BasicComponentId.Frame,
  name: 'Frame',
  props: {
  },
  defaultSize: {
    width: [LengthUnit.FIXED, 300],
    height: [LengthUnit.FIXED, 300]
  },
  hasChildren: true
}

export default FrameConfig
