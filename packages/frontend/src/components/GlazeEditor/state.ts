import { BehaviorSubject, combineLatestWith, Subscription } from 'rxjs'
import * as Y from 'yjs'
import { NodeProxy, StructureProxy } from './yjs.hook'
import { ComponentFullInfo, createBasicComponentMap } from '../BasicComponents/basicComponentMap'
import { useParams } from 'react-router-dom'
import React, { useEffect } from 'react'
import { editorSharedDocument } from './EditorSharedDocument'
import { ObservableMap } from '../../utils/ObservableMap'
import { useObservableEagerState } from 'observable-hooks'
import { useCurrentUser } from '../../hooks/self.hook'
import { Zoom } from '@glaze/zoom'
import { GlazeAwarenessState } from './provider/WebsocketProvider'
import { notEmpty } from '@glaze/common'
export const zoom = new Zoom()

export interface FullNodeInfo {
  nodeProxy: NodeProxy
  parentStructureInfo?: Y.Map<any>
  structureProxy: StructureProxy
  wrapper: HTMLDivElement
  position: StaticPosition
}

/**
 * 一个元素缩放前的位置信息，通过缩放数值反向计算
 */
export interface StaticPosition {
  x: number
  y: number
  width: number
  height: number
}

export const SelectedNodeInfoSubject = new BehaviorSubject<string | null>(null)

export const AllNodeInfoObservableMap = new ObservableMap<string, FullNodeInfo>()

export const EditorPositionSubject = new BehaviorSubject<DOMRect | null>(null)

export const AllComponentsSubject = new BehaviorSubject<Map<string, ComponentFullInfo>>(
  createBasicComponentMap()
)

export const AllCooperateUserState = new BehaviorSubject<GlazeAwarenessState[]>([])

export const refreshEditorState = () => {
  SelectedNodeInfoSubject.next(null)
  EditorPositionSubject.next(null)
  AllComponentsSubject.next(createBasicComponentMap())
}

/**
 * projectId 变化更新状态
 */
export const useProjectIdChange = () => {
  const { projectId } = useParams<{ projectId: string }>()

  useUserAwareness()

  useEffect(() => {
    if (projectId) {
      const projectIdNum = Number(projectId)
      editorSharedDocument.connect(projectIdNum, AllCooperateUserState)
    }
    return () => {
      editorSharedDocument.close()
      refreshEditorState()
    }
  }, [projectId])
}

export const useUserAwareness = () => {
  const { data: userData } = useCurrentUser()
  const userInfo = userData?.data
  useEffect(() => {
    const subscription = new Subscription()
    if (userInfo) {
      subscription.add(
        SelectedNodeInfoSubject.pipe(
          combineLatestWith(editorSharedDocument.webSocketProviderSubject)
        ).subscribe(([selectedNodeId, websocketProvider]) => {
          if (userInfo) {
            websocketProvider?.setAwarenessUserState({
              userInfo,
              selectedNodeId
            })
          }

          if (!notEmpty(websocketProvider)) {
            AllCooperateUserState.next([])
          }
        })
      )
    }
    return () => {
      subscription.unsubscribe()
    }
  }, [userInfo])
}

export const useNodeInfoObserve = (
  nodeProxy: NodeProxy,
  structureProxy: StructureProxy,
  wrapperRef: React.RefObject<HTMLDivElement>,
  parentStructureInfo?: Y.Map<any>
) => {
  const editorPosition = useObservableEagerState(EditorPositionSubject)
  useEffect(() => {
    if (wrapperRef.current && editorPosition) {
      const { x: editorX, y: editorY } = editorPosition
      const { x, y, width, height } = wrapperRef.current.getBoundingClientRect()
      // 获得节点在画布上的 x 和 y
      const { x: staticX, y: staticY } = zoom.invert({ x: x - editorX, y: y - editorY })

      // 获得节点在画布上的 width 和 height
      const staticWidth = width / zoom.transform.k
      const staticHeight = height / zoom.transform.k
      const position: StaticPosition = {
        x: staticX,
        y: staticY,
        width: staticWidth,
        height: staticHeight
      }
      AllNodeInfoObservableMap.set(nodeProxy.id, {
        nodeProxy,
        parentStructureInfo,
        structureProxy,
        wrapper: wrapperRef.current,
        position
      })
    }
  })
}
