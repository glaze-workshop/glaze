import { GlazeButtonProps } from '.'
import { ComponentConfig } from '../../../schema/config'
import { LengthUnit } from '../../../schema/length'
import { BasicComponentId } from '../basicComponentInfo'

const GlazeButtonConfig: ComponentConfig<GlazeButtonProps> = {
  id: BasicComponentId.Button,
  name: 'Button',
  props: {},
  defaultSize: {
    width: [LengthUnit.FIXED, 100],
    height: [LengthUnit.FIXED, 50]
  }
}

export default GlazeButtonConfig
