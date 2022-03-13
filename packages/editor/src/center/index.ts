import { Log } from '../utils'

import { ComponentsMonitorEventType } from './type'
import { componentsRootPath } from './config'
import LCPServer from './LCPServer'
import ComponentsController from './ComponentsController'
import ComponentsMonitor from './ComponentsMonitor'
import { EditorComponentInfo, EditorComponentState, EditorSubscribeType } from '@glaze/common'
import path from 'path'

export const server = new LCPServer(new ComponentsController())

export const componentsMap: Map<string, EditorComponentInfo> = new Map()

const monitor = new ComponentsMonitor(componentsRootPath)

monitor.on(ComponentsMonitorEventType.Create, (e) => {
  Log.center(`create component: ${e.componentName}`, e)

  const name = e.componentName as string
  // const componentInfo = this.initComponent(name)

  componentsMap.set(name, {
    name,
    state: EditorComponentState.Init,
    sourcePath: path.join(monitor.root, name),
    targetPath: ''
  })
  // this.componentsMap.set(name, componentInfo)
  // this.notify({
  //   type: EditorCenterEventType.ComponentListUpdate
  // })
  // this.notify({
  //   type: EditorCenterEventType.ComponentCreate,
  //   componentName: name
  // })
  server.publish<EditorSubscribeType>(EditorSubscribeType.ComponentList, [...componentsMap.values()])
})

monitor.on(ComponentsMonitorEventType.Remove, (e) => {
  Log.center(`remove component: ${e.componentName}`, e)

  const name = e.componentName as string

  componentsMap.delete(name)
  // const name = e.componentName as string
  // this.componentsMap.delete(name)
  // this.notify({
  //   type: EditorCenterEventType.ComponentListUpdate
  // })
  // this.notify({
  //   type: EditorCenterEventType.ComponentRemove,
  //   componentName: name
  // })
  server.publish<EditorSubscribeType>(EditorSubscribeType.ComponentList, [...componentsMap.values()])
})

monitor.on(ComponentsMonitorEventType.Update, (e) => {
  Log.center(`update component: ${e.componentName}`, e)

  const name = e.componentName as string

  // const info = this.componentsMap.get(name)
  // info.state = ComponentState.Updating

  // this.notify({
  //   type: EditorCenterEventType.ComponentUpdate,
  //   componentName: name
  // })
  server.publish<EditorSubscribeType>(EditorSubscribeType.ComponentList, [...componentsMap.values()])
})
