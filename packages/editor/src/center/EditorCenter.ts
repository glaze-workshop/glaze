import path from 'path'
import { WebSocket } from 'ws'
import { EditorType } from '@glaze/common'
import webpack from 'webpack'

import { EditorWebSocketResponseType } from '../routers/type'
import { getWebpackBaseConfig, Log, sendMessage } from '../utils'
import monitor from './ComponentsMonitor'
import { ComponentsMonitorEventType } from './type'
import { componentStaticPrefix } from './config'

const { ComponentState, EditorCenterEventType } = EditorType
class EditorCenter {
  private connections: Set<WebSocket> = new Set()
  private componentsMap: Map<string, EditorType.ComponentInfo> = new Map() // componentName => componentInfo
  private isMonitorInit: boolean = false

  constructor() {
    // listen ready event
    const waitForMonitorReady = () => {
      this.isMonitorInit = true
      monitor.off(ComponentsMonitorEventType.Ready, waitForMonitorReady)

      Log.center('Monitor ready:', this.componentsMap)
    }
    monitor.on(ComponentsMonitorEventType.Ready, waitForMonitorReady)

    // listen normal event
    monitor
      .on(ComponentsMonitorEventType.HeartBeat, () => {
        Log.center('monitor heartbeat', new Date())
      })
      .on(ComponentsMonitorEventType.Create, (e) => {
        Log.center(`create component: ${e.componentName}`, e)

        const name = e.componentName as string
        const componentInfo = this.initComponent(name)

        this.componentsMap.set(name, componentInfo)
        this.notify({
          type: EditorCenterEventType.ComponentListUpdate
        })
        this.notify({
          type: EditorCenterEventType.ComponentCreate,
          componentName: name
        })
      })
      .on(ComponentsMonitorEventType.Remove, (e) => {
        Log.center(`remove component: ${e.componentName}`, e)

        const name = e.componentName as string
        this.componentsMap.delete(name)
        this.notify({
          type: EditorCenterEventType.ComponentListUpdate
        })
        this.notify({
          type: EditorCenterEventType.ComponentRemove,
          componentName: name
        })
      })
      .on(ComponentsMonitorEventType.Update, (e) => {
        Log.center(`update component: ${e.componentName}`, e)

        const name = e.componentName as string

        const info = this.componentsMap.get(name)
        info.state = ComponentState.Updating

        // this.notify({
        //   type: EditorCenterEventType.ComponentUpdate,
        //   componentName: name
        // })
      })
  }

  /**
   * Connections Management
   */
  addConnection(ws: WebSocket) {
    this.connections.add(ws)
  }

  removeConnection(ws: WebSocket) {
    this.connections.delete(ws)
  }

  private notify(e: EditorType.EditorCenterEvent) {
    // notify after monitor init
    if (this.isMonitorInit) {
      const res = {
        type: EditorWebSocketResponseType.LocalEvent,
        data: e
      }

      Log.center('notify, res:', res)

      this.connections.forEach((ws) => {
        sendMessage(ws, res)
      })
    }
  }

  /**
   * Outer interface
   */
  getComponentList() {
    return [...this.componentsMap.values()]
  }

  private initComponent(componentName: string): EditorType.ComponentInfo {
    const sourcePath = path.join(monitor.root, componentName)

    const info = {
      name: componentName,
      state: ComponentState.Null,
      sourcePath,
      targetPath: ''
    }

    const compiler = this.createCompiler(componentName, sourcePath, info)

    return info
  }

  private createCompiler(componentName: string, sourcePath: string, info: EditorType.ComponentInfo) {
    const config = getWebpackBaseConfig()

    // Log.center('createCompiler', config)
    // Log.center('createCompiler', config.module?.rules)

    config.entry = path.join(sourcePath, 'index')
    config.output && (config.output.path = `${config.output.path}/${componentName}`)
    config.output && (config.output.filename = `${componentName}-[hash:5].js`)
    Log.webpack('createCompiler', config)

    const compiler = webpack(config)
    compiler.watch({}, (err, result) => {
      Log.webpack('compiler run', err)
      // check state
      if (info.state !== ComponentState.Updating) {
        Log.webpack(`compile state check fail: expected ${ComponentState.Updating}, get ${info.state}`)
      }

      // update with compile state
      if (result?.hasErrors()) {
        Log.webpack(`compile ${componentName} error occur`)
        info.state = ComponentState.Fail
      } else {
        Log.webpack(`compile ${componentName} success`, result.hash)
        info.state = ComponentState.Ready
        // @ts-ignore
        info.targetPath = `${componentStaticPrefix}/${componentName}/${componentName}.js`

        this.notify({
          type: EditorCenterEventType.ComponentUpdate,
          componentName,
          requestUrl: `${componentStaticPrefix}/${componentName}/${componentName}-${result.hash.substring(0, 5)}.js`
        })
      }
    })
  }

  createComponent(componentName: string): boolean {
    const componentInfo = this.initComponent(componentName)

    this.componentsMap.set(componentName, componentInfo)

    return true
  }

  removeComponent(componentName: string): boolean {
    return true
  }

  check() {
    return {
      connections: this.connections.size,
      components: this.componentsMap,
      isMonitorInit: this.isMonitorInit
    }
  }
}

/**
 * Singleton Center
 */
const center = new EditorCenter()

export default center
