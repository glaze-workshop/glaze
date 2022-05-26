/* eslint-disable no-undef */

import {
  EditorComponentInfo,
  EditorComponentState,
  EditorRequestType,
  EditorSubscribeType
} from '@glaze/common'
import React, { useEffect, useRef, useState } from 'react'

import { Log } from '../../../utils/log'
import { AllComponentsSubject } from '../state'
import { CustomComponentInfo, CustomComponentMeta } from './type'
import {
  createCustomComponentFullInfo,
  createCustomComponentId,
  isCustomComponentId,
  noop
} from './utils'
import { getEditorClient } from './client'

/**
 * Subscribe local editor component
 * return specific Component & state
 */
export const useCustomComponent = (componentName: string) => {
  const [componentInfo, setComponentInfo] = useState<CustomComponentInfo>({
    loading: true,
    error: false
  })

  const updateInfo = (info: EditorComponentInfo) => {
    const loading = [EditorComponentState.Init, EditorComponentState.Updating].includes(info.state)
    const error = [EditorComponentState.Fail].includes(info.state)

    setComponentInfo({
      loading,
      error,
      info,
      Component: loading
        ? undefined
        : React.lazy(() => {
            const c = System.import(info.targetPath)
            return c.then((res) => {
              if (!res.default) {
                setComponentInfo({
                  loading: false,
                  error: true,
                  errorMsg: `Component ${componentName} is Empty...`,
                  info,
                  Component: undefined
                })
                return {}
              } else {
                return res
              }
            })
          })
    })
  }

  /**
   * Request at first & Subscribe update
   */
  const unsubscribeRef = useRef(noop)
  useEffect(() => {
    const client = getEditorClient()

    const loadComponent = (componentInfo: EditorComponentInfo) => {
      Log.EditorCustomSupportHook(`componentInfo of ${componentName}`, componentInfo)
      if (componentInfo) {
        updateInfo(componentInfo)
      }
    }

    client
      .request<EditorComponentInfo>(EditorRequestType.Component(componentName))
      .then((componentInfo) => {
        loadComponent(componentInfo)
      })
      .catch((err) => {
        console.error(
          `[useCustomComponent] subscribe ${EditorRequestType.Component(componentName)} error`,
          err
        )
      })

    client
      .subscribe<EditorComponentInfo>(
        EditorSubscribeType.Component(componentName),
        undefined,
        (componentInfo) => {
          loadComponent(componentInfo)
        }
      )
      .then((unsubscribe) => {
        unsubscribeRef.current = unsubscribe
      })
      .catch((err) => {
        console.error(
          `[useCustomComponent] subscribe ${EditorSubscribeType.Component(componentName)} error`,
          err
        )
      })
    return () => {
      unsubscribeRef.current()
    }
  }, [componentName])

  return componentInfo
}

/**
 * Subscribe local editor component list
 *   sync to AllComponentsSubject
 */
export const useCustomComponentList = (): CustomComponentMeta[] => {
  const [componentList, setComponentList] = useState<CustomComponentMeta[]>([])

  /**
   * Subscribe AllComponentsSubject & Extract CustomComponentList
   */
  useEffect(() => {
    const subscriber = AllComponentsSubject.subscribe((allComponentsMap) => {
      const componentList = [...allComponentsMap.entries()]
        .filter(([componentId]) => isCustomComponentId(componentId))
        .map(
          ([componentId, componentInfo]): CustomComponentMeta => ({
            id: componentId,
            name: componentInfo.config.name
          })
        )

      setComponentList(componentList)
    })

    return () => {
      subscriber.unsubscribe()
    }
  }, [])

  /**
   * Subscribe local componentList
   */
  const unsubscribeRef = useRef(noop)
  useEffect(() => {
    const client = getEditorClient()

    const updateComponentList = (componentList: EditorComponentInfo[]) => {
      updateCustomComponentInfo(componentList.map((comp) => comp.name))
    }

    client
      .request<EditorComponentInfo[]>(EditorRequestType.ComponentList)
      .then(updateComponentList)
      .catch((err) => {
        console.error(
          `[useCustomComponentList] request ${EditorRequestType.ComponentList} error`,
          err
        )
      })

    client
      .subscribe<EditorComponentInfo[]>(
        EditorSubscribeType.ComponentList,
        undefined,
        updateComponentList
      )
      .then((unsubscribe) => {
        unsubscribeRef.current = unsubscribe
      })
      .catch((err) => {
        console.error(
          `[useCustomComponentList] subscribe ${EditorSubscribeType.ComponentList} error`,
          err
        )
      })

    return () => {
      unsubscribeRef.current()
    }
  }, [])

  return componentList
}

/**
 * *private
 * Update Custom component list in AllComponentsSubject
 */
const updateCustomComponentInfo = (componentNameList: string[]) => {
  const newComponentIdMap = new Map(
    // id => name
    componentNameList.map((name) => [createCustomComponentId(name), name])
  )

  const originComponents = AllComponentsSubject.getValue()
  const newComponents = new Map(originComponents)
  let componentsChanged = false

  newComponents.forEach((_, componentId) => {
    if (isCustomComponentId(componentId)) {
      if (newComponentIdMap.has(componentId)) {
        // component exists
        newComponentIdMap.delete(componentId)
      } else {
        // component removed
        newComponents.delete(componentId)
        componentsChanged = true
      }
    }
  })

  newComponentIdMap.forEach((componentName, componentId) => {
    // new components
    const info = createCustomComponentFullInfo(componentName)
    newComponents.set(componentId, info)
    componentsChanged = true
  })

  if (componentsChanged) {
    Log.EditorCustomSupportHook('New custom component list', componentNameList, newComponents)
    AllComponentsSubject.next(newComponents)
  }
}
