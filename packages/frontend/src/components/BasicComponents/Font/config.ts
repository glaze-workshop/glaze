import { ComponentConfig, ControlType, LengthUnit } from '@glaze/types'
import { FontProps } from '.'
import { BasicComponentId } from '../basicComponentInfo'

const FontConfig: ComponentConfig<FontProps> = {
  id: BasicComponentId.Font,
  name: 'Font',
  props: {
    content: {
      name: '内容',
      type: ControlType.TEXT,
      default: '请输入'
    },
    font: {
      name: '字体',
      type: ControlType.FONT,
      default: {
        fontSize: '14',
        color: 'rgb(196 196 196)'
      }
    }
  },
  defaultSize: {
    width: [LengthUnit.FIXED, 100],
    height: [LengthUnit.AUTO]
  }
}

export default FontConfig
