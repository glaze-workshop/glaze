import { FontProps } from '.'
import { ComponentConfig, ControlType } from '../../../schema/config'

const FontConfig: ComponentConfig<FontProps> = {
  id: '@glaze/font',
  name: '文字',
  props: {
    content: {
      name: '内容',
      type: ControlType.TEXT,
      default: '请输入'
    }
  }
}

export default FontConfig
