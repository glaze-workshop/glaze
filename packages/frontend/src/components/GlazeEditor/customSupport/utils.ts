import { LengthUnit } from '../../../schema/length'
import { ComponentConfig } from '../../../schema/config'
import { ComponentFullInfo } from '../../BasicComponents/basicComponentMap'
import CustomComponentHOC, {
  BoundComponentProps
} from '../../CustomComponent/hoc'

const CUSTOM_COMPONENT_ID_PREFIX = '@glaze-editor-component'

export const noop = () => {}

/**
 * 生成 ComponentId
 */
export const createCustomComponentId = (componentName: string) =>
  `${CUSTOM_COMPONENT_ID_PREFIX}/${componentName}`

export const isCustomComponentId = (componentId: string) =>
  componentId.startsWith(CUSTOM_COMPONENT_ID_PREFIX)

/**
 * 根据 componentName 创建 ComponentFullInfo
 */
export const createCustomComponentFullInfo = (
  componentName: string
): ComponentFullInfo => {
  const config: ComponentConfig<BoundComponentProps> = {
    id: createCustomComponentId(componentName),
    name: componentName,
    props: {},
    defaultSize: {
      width: [LengthUnit.AUTO],
      height: [LengthUnit.AUTO]
    }
  }

  return { config, component: CustomComponentHOC(componentName) }
}
