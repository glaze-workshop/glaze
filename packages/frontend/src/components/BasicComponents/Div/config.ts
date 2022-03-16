import { LengthUnit } from '../../../schema/length'
import { GlazeDivProps } from '.'
import { ComponentConfig, ControlType } from '../../../schema/config'
import { BasicComponentId } from '../basicComponentInfo'

const GlazeDivConfig: ComponentConfig<GlazeDivProps> = {
  id: BasicComponentId.Div,
  name: 'Div',
  props: {},
  defaultSize: {
    width: [LengthUnit.FIXED, 50],
    height: [LengthUnit.FIXED, 50]
  }
}

export default GlazeDivConfig
