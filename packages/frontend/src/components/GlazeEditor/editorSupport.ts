import React, { LazyExoticComponent, useEffect, useRef, useState } from 'react'
import {
  EditorComponentInfo,
  EditorRequestType,
  EditorSubscribeType,
  LCPClient,
  LCPSocket
} from '@glaze/common'

let client: LCPClient | null = null

export const getEditorClient = (): LCPClient => {
  if (client) {
    return client
  }

  // init once
  return (client = new LCPClient(
    new LCPSocket({ url: 'ws://localhost:8999/ws', heartbeat: true })
  ))
}

const DEFAULT_UNSUBSCRIBE = () => {}

export const useEditorComponent = (componentName: string) => {
  const [component, setComponent] = useState<LazyExoticComponent<any> | null>(
    null
  )

  const unsubscribeRef = useRef(DEFAULT_UNSUBSCRIBE)
  useEffect(() => {
    const client = getEditorClient()

    const loadComponent = (componentList: EditorComponentInfo[]) => {
      const componentInfo = componentList.filter(
        (component) => component.name === componentName
      )[0]
      if (componentInfo) {
        setComponent(
          // eslint-disable-next-line no-undef
          React.lazy(() => System.import(componentInfo.targetPath))
        )
      } else {
        setComponent(null)
      }
    }

    // client.request(EditorRequestType.ComponentList)
    client
      .request<EditorComponentInfo[]>(EditorRequestType.ComponentList)
      .then((componentList) => {
        loadComponent(componentList)
      })

    client
      .subscribe<EditorComponentInfo[]>(
        EditorSubscribeType.ComponentList,
        undefined,
        (componentList) => {
          loadComponent(componentList)
        }
      )
      .then((unsubscribe) => {
        unsubscribeRef.current = unsubscribe
      })
    return () => {
      unsubscribeRef.current()
    }
  }, [componentName])

  return component
}

// const loadComponentA = (componentList: EditorComponentInfo[]) => {
//   const AInfo = componentList.filter((comp) => comp.name === 'A')[0]
//   console.log('AInfo', AInfo)
//   if (AInfo) {
//     // eslint-disable-next-line no-undef
//     const A = React.lazy(() => System.import(AInfo.targetPath))
//     setA(A)
//   }
// }

// client
//   .request(EditorRequestType.ComponentList)
//   .then((componentList) => {
//     console.log('getComponentList', componentList)
//     loadComponentA(componentList)
//   })
//   .catch((err) => {
//     console.log('getComponentList error', err)
//   })

// client
//   .subscribe<EditorComponentInfo[]>(
//     EditorSubscribeType.ComponentList,
//     undefined,
//     (componentList) => {
//       console.log('componentList', componentList)
//       loadComponentA(componentList)
//     }
//   )
//   .then((unsubscribe) => {
//     // console.log('unsubscribe', unsubscribe)
//     // setTimeout(() => {
//     //   unsubscribe()
//     // }, 10 * 1000)
//   })
