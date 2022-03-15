import { EditorRequestType, LCPClientMessage, LCPServerController } from '@glaze/common'

import { componentsCenter } from '..'

class ComponentsController implements LCPServerController {
  handleRequest(msg: LCPClientMessage): Promise<any> {
    console.log('clientMessage', msg)

    switch (msg.path) {
      case EditorRequestType.ComponentList:
        return Promise.resolve(componentsCenter.getComponentsList())

      default:
        return Promise.reject(new Error('Unknown request type'))
    }
  }
}

export default ComponentsController
