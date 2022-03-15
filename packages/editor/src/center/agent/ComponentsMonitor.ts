import chokidar from 'chokidar'
import path from 'path'

import { Log } from '../../utils'
import { ComponentsMonitorCallback, ComponentsMonitorEvent, ComponentsMonitorEventType } from '../type'
import { belongsTo, isComponentDir } from '../utils'

class ComponentsMonitor {
  root: string
  private watcher: chokidar.FSWatcher
  private listenerMap: Map<ComponentsMonitorEventType, Set<ComponentsMonitorCallback>> = new Map()

  constructor(root: string) {
    this.root = root
    this.startWatcher()

    // setInterval(() => {
    //   this.emit(ComponentsMonitorEventType.HeartBeat)
    // }, 1000)
  }

  private startWatcher() {
    const root = this.root
    const componentsWatcher = (this.watcher = chokidar.watch(root))

    const collectInitComponents = (_path: string) => {
      if (isComponentDir(this.root, _path)) {
        const componentName = path.basename(_path)
        Log.monitor(`Init Component: ${componentName}`)
        this.emit(ComponentsMonitorEventType.Create, componentName)
      }
    }

    componentsWatcher
      .on('ready', () => {
        Log.monitor(`monitor ready, watch: ${root}`)

        this.emit(ComponentsMonitorEventType.Ready)

        // remove init listener
        componentsWatcher.off('addDir', collectInitComponents)

        // start listen file change after ready
        componentsWatcher
          // handle directory changes
          .on('addDir', (_path, stats) => {
            if (isComponentDir(this.root, _path)) {
              /**
               * Create new Component
               */
              const componentName = path.basename(_path)
              Log.monitor(`addDir: ${_path} --- New Component: ${componentName}`)

              this.emit(ComponentsMonitorEventType.Create, componentName)
            } else {
              /**
               * Add directory in component
               */
              const componentName = belongsTo(this.root, _path)
              if (componentName) {
                Log.monitor(`addDir: ${_path} --- Update Component: ${componentName}`)
                this.emit(ComponentsMonitorEventType.Update, componentName)
              }
            }
          })
          .on('unlinkDir', (_path) => {
            if (isComponentDir(this.root, _path)) {
              /**
               * Remove Component
               */
              const componentName = path.basename(_path)
              Log.monitor(`unlinkDir: ${_path} --- Remove Component: ${componentName}`)

              this.emit(ComponentsMonitorEventType.Remove, componentName)
            } else {
              /**
               * Remove directory in Component
               */
              const componentName = belongsTo(this.root, _path)
              if (componentName) {
                Log.monitor(`unlinkDir: ${_path} --- Update Component: ${componentName}`)
                this.emit(ComponentsMonitorEventType.Update, componentName)
              }
            }
          })
          // handle file changes
          .on('add', (_path, stats) => {
            const componentName = belongsTo(this.root, _path)
            if (componentName) {
              /**
               * Add file in Component
               */
              Log.monitor(`add: ${_path} --- Update Component: ${componentName}`)
              this.emit(ComponentsMonitorEventType.Update, componentName)
            }
          })
          .on('unlink', (_path) => {
            Log.monitor(`unlink: ${_path}`)
            const componentName = belongsTo(this.root, _path)
            if (componentName) {
              /**
               * Remove file in Component
               */
              Log.monitor(`unlink: ${_path} --- Update Component: ${componentName}`)
              this.emit(ComponentsMonitorEventType.Update, componentName)
            }
          })
          .on('change', (_path, stats) => {
            Log.monitor(`change: ${_path}`)

            const componentName = belongsTo(this.root, _path)
            if (componentName) {
              /**
               * Edit File in Component
               */
              Log.monitor(`change: ${_path} --- Update Component: ${componentName}`)
              this.emit(ComponentsMonitorEventType.Update, componentName)
            }
          })
      })
      .on('addDir', collectInitComponents)
      .on('error', (err) => {
        Log.monitor('error', err)
        // componentsWatcher.close()
        // this.startWatcher()
      })
  }

  private getListeners(type: ComponentsMonitorEventType): Set<ComponentsMonitorCallback> {
    const listeners: Set<ComponentsMonitorCallback> = this.listenerMap.get(type) || new Set()
    if (this.listenerMap.has(type)) {
      return listeners
    } else {
      this.listenerMap.set(type, listeners)
      return listeners
    }
  }

  on(type: ComponentsMonitorEventType, cb: ComponentsMonitorCallback): () => void {
    this.getListeners(type).add(cb)

    let unsubscribed = false
    return () => {
      if (unsubscribed) {
        return
      }

      this.getListeners(type).delete(cb)
      unsubscribed = true
    }
  }

  private emit(type: ComponentsMonitorEventType, componentName?: string) {
    const event: ComponentsMonitorEvent = { type, componentName }

    this.getListeners(type).forEach((cb) => {
      cb(event)
    })
  }

  close() {
    this.watcher.close()
  }
}

export default ComponentsMonitor
