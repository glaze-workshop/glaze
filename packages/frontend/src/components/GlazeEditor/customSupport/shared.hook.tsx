import { ComponentApi } from '@glaze/common'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import React, { FC, Suspense, useEffect, useMemo } from 'react'
import { AllComponentsSubject } from '../state'
import { ComponentType } from '../../BasicComponents/basicComponentMap'
import { SetRequired } from 'type-fest'
import Module = System.Module

export function useSharedComponentList() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data, isLoading } = useQuery([ComponentApi.FULL_COMPONENT_PATH, projectId], () =>
    ComponentApi.getComponents({ projectId: Number(projectId) })
  )

  const componentList = useMemo(() => data?.data ?? [], [data?.data])

  useEffect(() => {
    const currentComponents = [...AllComponentsSubject.value.entries()]

    currentComponents
      .filter(([, component]) => component.type === ComponentType.SHARED)
      .forEach(([id]) => AllComponentsSubject.value.delete(id))

    componentList.forEach((item) => {
      const path = `https://${item.path}`
      System.delete(path)

      const Node = React.lazy(() => {
        return System.import(path).then((res) => {
          if (!res.default) {
            return { default: {} }
          } else {
            return res as SetRequired<Module, 'default'>
          }
        })
      })
      const N: FC = (props) => {
        return (
          <Suspense>
            <Node {...props} />
          </Suspense>
        )
      }

      AllComponentsSubject.value.set(item.id, {
        config: { ...item, hasChildren: item.hasChildren },
        component: N,
        type: ComponentType.SHARED
      })
    })

    AllComponentsSubject.next(AllComponentsSubject.value)
  }, [componentList])

  return { componentList, isLoading }
}
