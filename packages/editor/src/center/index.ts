import { EditorComponentState, EditorSubscribeType } from '@glaze/common'
import { debounce } from 'lodash'

import { Log } from '../utils'
import LCPServer from './agent/LCPServer'
import ComponentsController from './agent/ComponentsController'
import { componentTargetPath, createComponentCompiler } from './webpackUtils'
import { componentsCenter, EditorComponentInfoInternal } from './agent/ComponentsCenter'
import { GlazeComponentConfig } from '@glaze/types'

export const server = new LCPServer(new ComponentsController())

export const handleStartWatch = (config: GlazeComponentConfig) => {
  Log.center(`create component: ${config.id}`, config)

  const compiler = createComponentCompiler(config.main)
  compiler.watch(
    {},
    debounce((err) => {
      if (err) {
        console.log('component watch error: ', err)
      }
      const newInfo: EditorComponentInfoInternal = {
        ...componentInfo,
        state: EditorComponentState.Ready,
        targetPath: componentTargetPath(config.main)
      }

      Log.center(`compiler onUpdate: ${config.id}`, newInfo.targetPath)

      componentsCenter.setComponent(newInfo)

      /**
       * Update:
       *   ComponentList
       *   Component_A
       */
      server.publish(EditorSubscribeType.Component(config.id), componentsCenter.getComponentInfo(config.id))
      server.publish(EditorSubscribeType.ComponentList, componentsCenter.getComponentsList())
    }, 500) // update delay
  )

  const componentInfo = {
    id: config.id,
    name: config.name,
    state: EditorComponentState.Init,
    sourcePath: config.main,
    targetPath: '',
    config,
    compiler
  }

  componentsCenter.setComponent(componentInfo)

  /**
   * Update:
   *   ComponentList
   */
  server.publish(EditorSubscribeType.ComponentList, componentsCenter.getComponentsList())
}

export const handleStartBuild = (config: GlazeComponentConfig) => {
  const compiler = createComponentCompiler(config.main)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  })
}
