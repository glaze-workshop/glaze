import { EditorComponentState, EditorSubscribeType } from '@glaze/common'
import path from 'path'
import { debounce } from 'lodash'

import { Log } from '../utils'
import { ComponentsMonitorEventType } from './type'
import { componentsRootPath, componentStaticPrefix } from './config'
import LCPServer from './agent/LCPServer'
import ComponentsController from './agent/ComponentsController'
import ComponentsMonitor from './agent/ComponentsMonitor'
import ComponentsCenter from './agent/ComponentsCenter'
import { createComponentCompiler } from './webpackUtils'

export const server = new LCPServer(new ComponentsController())

export const componentsCenter = new ComponentsCenter()

const monitor = new ComponentsMonitor(componentsRootPath)

monitor.on(ComponentsMonitorEventType.Create, (e) => {
  Log.center(`create component: ${e.componentName}`, e)

  const name = e.componentName as string

  const compiler = createComponentCompiler({
    componentName: name,
    entry: path.join(monitor.root, name, 'index'),
    onUpdate: debounce(({ hash }) => {
      const newInfo = {
        ...componentInfo,
        state: EditorComponentState.Ready,
        targetPath: `${componentStaticPrefix}/${name}/${name}-${hash}.js`
      }

      Log.center(`compiler onUpdate: ${name}`, newInfo.targetPath)

      componentsCenter.setComponent(newInfo)

      /**
       * Update:
       *   ComponentList
       *   Component_A
       */
      server.publish<EditorSubscribeType>(EditorSubscribeType.ComponentList, componentsCenter.getComponentsList())
    }, 500) // update delay
  })

  const componentInfo = {
    name,
    state: EditorComponentState.Init,
    sourcePath: path.join(monitor.root, name),
    targetPath: '',
    compiler
  }

  componentsCenter.setComponent(componentInfo)

  /**
   * Update:
   *   ComponentList
   */
  server.publish<EditorSubscribeType>(EditorSubscribeType.ComponentList, componentsCenter.getComponentsList())
})

monitor.on(ComponentsMonitorEventType.Remove, (e) => {
  Log.center(`remove component: ${e.componentName}`, e)

  const name = e.componentName as string

  componentsCenter.removeComponent(name)

  /**
   * Update:
   *   ComponentList
   *   Component_X
   */
  server.publish<EditorSubscribeType>(EditorSubscribeType.ComponentList, componentsCenter.getComponentsList())
})

// monitor.on(ComponentsMonitorEventType.Update, (e) => {
//   Log.center(`update component: ${e.componentName}`, e)

//   const name = e.componentName as string

//   const info = this.componentsMap.get(name)
//   info.state = ComponentState.Updating

//   this.notify({
//     type: EditorCenterEventType.ComponentUpdate,
//     componentName: name
//   })
//   server.publish<EditorSubscribeType>(EditorSubscribeType.ComponentList, [...componentsMap.values()])
// })
