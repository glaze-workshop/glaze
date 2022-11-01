import { EditorComponentInfo } from '@glaze/common'
import { Compiler } from 'webpack'
import { Log } from '../../utils'

export interface EditorComponentInfoInternal extends EditorComponentInfo {
  sourcePath: string
  compiler: Compiler
}

class ComponentsCenter {
  private componentsMap: Map<string, EditorComponentInfoInternal> = new Map()

  setComponent(info: EditorComponentInfoInternal) {
    Log.components('set', info.id)
    this.componentsMap.set(info.id, info)
    Log.components('current components', [...this.componentsMap.keys()])
  }

  removeComponent(id: string) {
    Log.components('remove', id)
    const info = this.componentsMap.get(id)
    info?.compiler.close((err, _result) => {
      Log.components(`compiler for ${id} closed`, err)
    })
    this.componentsMap.delete(id)
    Log.components('current components', [...this.componentsMap.keys()])
  }

  clear() {
    this.componentsMap.forEach((item) =>
      item.compiler.close((err, _result) => {
        Log.components(`compiler for ${item.id} closed`, err)
      })
    )
  }

  /**
   * ComponentsList in EditorComponentInfo
   */
  getComponentsList(): EditorComponentInfo[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return [...this.componentsMap.values()].map(({ sourcePath, compiler, ...info }) => {
      return info
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
  getComponentInfo(id: string): EditorComponentInfo | void {
    const selectedNode = this.componentsMap.get(id)
    if (selectedNode) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sourcePath, compiler, ...info } = selectedNode
      return info
    }
  }
}

export default ComponentsCenter

export const componentsCenter = new ComponentsCenter()
