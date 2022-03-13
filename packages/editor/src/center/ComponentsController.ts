import { EditorRequestType, LCPClientMessage, LCPServerController } from '@glaze/common'

import { componentsMap } from '.'

// const { EditorRequestType } = EditorType

class ComponentsController implements LCPServerController {
  handleRequest(msg: LCPClientMessage): Promise<any> {
    console.log('clientMessage', msg)

    // switch (msg.route) {
    //   case EditorRequestType.ComponentList:
    //     return Promise.resolve(center.getComponentList())
    // }
    switch (msg.path) {
      case EditorRequestType.ComponentList:
        return Promise.resolve([...componentsMap.values()])

      default:
        return Promise.reject(new Error('Unknown request type'))
    }
  }
}

export default ComponentsController
