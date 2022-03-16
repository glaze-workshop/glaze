import { EditorComponentInfo, EditorComponentInfoInternal } from '@glaze/common'
import { Log } from '../../utils'

class ComponentsCenter {
  private componentsMap: Map<string, EditorComponentInfoInternal> = new Map()

  setComponent(info: EditorComponentInfoInternal) {
    Log.components('set', info.name)
    this.componentsMap.set(info.name, info)
    Log.components('current components', [...this.componentsMap.keys()])
  }

  removeComponent(name: string) {
    Log.components('remove', name)
    this.componentsMap.delete(name)
    Log.components('current components', [...this.componentsMap.keys()])
  }

  /**
   * ComponentsList in EditorComponentInfo
   */
  getComponentsList(): EditorComponentInfo[] {
    return [...this.componentsMap.values()].map(({ name, state, targetPath }) => {
      return {
        name,
        state,
        targetPath
      }
    })
  }

  /**
   * ComponentsList in EditorComponentInfoInternal
   */
  getComponentsListDetail(): EditorComponentInfoInternal[] {
    return [...this.componentsMap.values()]
  }

  /**
   * Single Component
   */
  getComponentInfoDetail(name: string): EditorComponentInfoInternal {
    return this.componentsMap.get(name)
  }
}

export default ComponentsCenter