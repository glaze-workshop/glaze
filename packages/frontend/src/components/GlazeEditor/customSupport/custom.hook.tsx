/* eslint-disable no-undef */

import {
  EditorComponentInfo,
  EditorComponentState,
  EditorRequestType,
  EditorSubscribeType
} from '@glaze/common'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Log } from '../../../utils/log'
import { AllComponentsSubject } from '../state'
import { CustomComponentInfo, CustomComponentMeta } from './type'
import { noop } from './utils'
import { getEditorClient } from './client'
import { SetRequired } from 'type-fest'
import CustomComponentHOC from '../../CustomComponent/hoc'
import { ComponentType } from '../../BasicComponents/basicComponentMap'
import Module = System.Module
import { BehaviorSubject } from 'rxjs'

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
        .filter(([, item]) => item.type === ComponentType.CUSTOM)
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

    client
      .request<EditorComponentInfo[]>(EditorRequestType.ComponentList)
      .then(updateCustomComponentInfo)
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
        updateCustomComponentInfo
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

const createCustomComponentInfo = async (
  id: string
): Promise<[BehaviorSubject<CustomComponentInfo>, () => void] | null> => {
  const componentInfo$ = new BehaviorSubject<CustomComponentInfo>({
    loading: true,
    error: false
  })

  const updateInfo = (info: EditorComponentInfo) => {
    const loading = [EditorComponentState.Init, EditorComponentState.Updating].includes(info.state)
    const error = [EditorComponentState.Fail].includes(info.state)

    System.delete(info.targetPath)
    componentInfo$.next({
      loading,
      error,
      info,
      Component: loading
        ? undefined
        : React.lazy(() => {
            const c = System.import(info.targetPath)
            return c.then((res) => {
              if (!res.default) {
                componentInfo$.next({
                  loading: false,
                  error: true,
                  errorMsg: `Component ${id} is Empty...`,
                  info,
                  Component: undefined
                })
                return { default: {} }
              } else {
                return res as SetRequired<Module, 'default'>
              }
            })
          })
    })
  }

  /**
   * Request at first & Subscribe update
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const client = getEditorClient()

  const loadComponent = (componentInfo: EditorComponentInfo) => {
    Log.EditorCustomSupportHook(`componentInfo of ${id}`, componentInfo)
    if (componentInfo) {
      updateInfo(componentInfo)
    }
  }

  client
    .request<EditorComponentInfo>(EditorRequestType.Component(id))
    .then((componentInfo) => {
      loadComponent(componentInfo)
    })
    .catch((err) => {
      console.error(`[useCustomComponent] subscribe ${EditorRequestType.Component(id)} error`, err)
    })

  try {
    const unsubscribe = await client.subscribe<EditorComponentInfo>(
      EditorSubscribeType.Component(id),
      undefined,
      (componentInfo) => {
        loadComponent(componentInfo)
      }
    )

    return [componentInfo$, unsubscribe]
  } catch (e) {
    console.error(`[useCustomComponent] subscribe ${EditorSubscribeType.Component(id)} error`, e)
    return null
  }
}

/**
 * *private
 * Update Custom component list in AllComponentsSubject
 */
const updateCustomComponentInfo = async (componentNameList: EditorComponentInfo[]) => {
  const newComponentIdMap = new Map(
    // id => name
    componentNameList.map((item) => [item.id, item])
  )

  const originComponents = AllComponentsSubject.getValue()
  const newComponents = new Map(originComponents)
  let componentsChanged = false

  newComponents.forEach((info, componentId) => {
    if (info.type === ComponentType.CUSTOM) {
      if (newComponentIdMap.has(componentId)) {
        // component exists
        newComponentIdMap.delete(componentId)
      } else {
        // component removed
        newComponents.get(componentId)?.unsubscribe?.()
        newComponents.delete(componentId)
        componentsChanged = true
      }
    }
  })

  await Promise.all(
    Array.from(newComponentIdMap.entries()).map(async ([componentId, info]) => {
      const sub = await createCustomComponentInfo(componentId)
      if (sub) {
        const [componentInfo$, unsubscribe] = sub
        newComponents.set(componentId, {
          config: info.config,
          component: CustomComponentHOC(componentInfo$),
          type: ComponentType.CUSTOM,
          unsubscribe
        })
        componentsChanged = true
      }
    })
  )

  if (componentsChanged) {
    Log.EditorCustomSupportHook('New custom component list', componentNameList, newComponents)
    AllComponentsSubject.next(newComponents)
  }
}
