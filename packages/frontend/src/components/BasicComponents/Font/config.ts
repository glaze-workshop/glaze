import { LengthUnit } from '../../../schema/length'
import { FontProps } from '.'
import { ComponentConfig, ControlType } from '../../../schema/config'
import { BasicComponentId } from '../basicComponentInfo'

const FontConfig: ComponentConfig<FontProps> = {
  id: BasicComponentId.Font,
  name: 'Font',
  props: {
    content: {
      name: '内容',
      type: ControlType.TEXT,
      default: '请输入'
    }
  },
  defaultSize: {
    width: [LengthUnit.FIXED, 100],
    height: [LengthUnit.AUTO]
  }
}

export default FontConfig
