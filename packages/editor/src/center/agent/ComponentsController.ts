import { EditorRequestType, LCPClientMessage, LCPServerController } from '@glaze/common'

import { Log } from '../../utils'
import { componentsCenter } from './ComponentsCenter'

class ComponentsController implements LCPServerController {
  handleRequest(msg: LCPClientMessage): Promise<any> {
    Log.controller('clientMessage', msg)

    switch (msg.path) {
      case EditorRequestType.ComponentList:
        return Promise.resolve(componentsCenter.getComponentsList())

      default: {
        if (msg.path.startsWith(EditorRequestType.Component(''))) {
          const componentName = msg.path.substring(EditorRequestType.Component('').length)
          Log.controller(`componentName: ${componentName}`)
          const componentInfo = componentsCenter.getComponentInfo(componentName)
          Log.controller('componentInfo', componentInfo)
          if (componentInfo) {
            return Promise.resolve(componentInfo)
          } else {
            return Promise.reject(new Error(`Component ${componentName} not found`))
          }
        }

        return Promise.reject(new Error('Unknown request type'))
      }
    }
  }
}

export default ComponentsController
