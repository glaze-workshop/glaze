import { BehaviorSubject, combineLatestWith, Subscription } from 'rxjs'
import * as Y from 'yjs'
import { getNodeIdInStructTree, NodeProxy, StructureProxy } from './yjs.hook'
import { ComponentFullInfo, createBasicComponentMap } from '../BasicComponents/basicComponentMap'
import { useParams } from 'react-router-dom'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { editorSharedDocument } from './EditorSharedDocument'
import { ObservableMap } from '../../utils/ObservableMap'
import { useObservableEagerState } from 'observable-hooks'
import { useCurrentUser } from '../../hooks/self.hook'
import { Point, Zoom } from '@glaze/zoom'
import { GlazeAwarenessState } from './provider/WebsocketProvider'
import { notEmpty } from '@glaze/common'
export const zoom = new Zoom()

export interface FullNodeInfo {
  nodeProxy: NodeProxy
  parentStructureInfo?: Y.Map<any>
  structureProxy: StructureProxy
  wrapper: HTMLDivElement
  position: StaticPosition
  deep: number
}

export interface DuplicateNodeInfo {
  nodeId: string
  parentNodeId?: string
  position: StaticPosition
  parentStructureInfo?: Y.Map<any>
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

/** 选中的节点 id */
export const SelectedNodeInfoSubject = new BehaviorSubject<string | null>(null)

/** 所有已经渲染的节点的详细，包括位置信息 */
export const AllNodeInfoObservableMap = new ObservableMap<string, FullNodeInfo>()

/** 编辑器左上角的位置 */
export const EditorPositionSubject = new BehaviorSubject<DOMRect | null>(null)

/** 所有组件 */
export const AllComponentsSubject = new BehaviorSubject<Map<string, ComponentFullInfo>>(
  createBasicComponentMap()
)

/** 所有协作的用户信息 */
export const AllCooperateUserState = new BehaviorSubject<GlazeAwarenessState[]>([])

/** 重复节点信息 */
export const DuplicateNodeObservableMap = new ObservableMap<string, Set<DuplicateNodeInfo>>()

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
      console.log('i am clean')
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
  deep: number,
  parentStructureInfo?: Y.Map<any>
) => {
  const editorPosition = useObservableEagerState(EditorPositionSubject)

  const getWrapperPosition = useCallback((): StaticPosition | void => {
    if (wrapperRef.current && editorPosition) {
      const { x: editorX, y: editorY } = editorPosition
      const { x, y, width, height } = wrapperRef.current.getBoundingClientRect()
      // 获得节点在画布上的 x 和 y
      const { x: staticX, y: staticY } = zoom.invert({ x: x - editorX, y: y - editorY })

      // 获得节点在画布上的 width 和 height
      const staticWidth = width / zoom.transform.k
      const staticHeight = height / zoom.transform.k
      return {
        x: staticX,
        y: staticY,
        width: staticWidth,
        height: staticHeight
      }
    }
  }, [editorPosition, wrapperRef])

  useLayoutEffect(() => {
    const position = getWrapperPosition()
    if (position && wrapperRef.current) {
      AllNodeInfoObservableMap.set(nodeProxy.id, {
        nodeProxy,
        parentStructureInfo,
        structureProxy,
        wrapper: wrapperRef.current,
        position,
        deep
      })
    }
  })

  useLayoutEffect(() => {
    let duplicateNodeInfo: DuplicateNodeInfo | null = null
    const position = getWrapperPosition()
    if (wrapperRef.current && position) {
      duplicateNodeInfo = {
        nodeId: nodeProxy.id,
        parentNodeId: parentStructureInfo ? getNodeIdInStructTree(parentStructureInfo) : undefined,
        parentStructureInfo,
        position
      }
      DuplicateNodeObservableMap.update(nodeProxy.id, (pre = new Set<DuplicateNodeInfo>()) => {
        pre.add(duplicateNodeInfo!)
        return pre
      })
    }
    return () => {
      AllNodeInfoObservableMap.delete(nodeProxy.id)
      if (duplicateNodeInfo) {
        DuplicateNodeObservableMap.update(nodeProxy.id, (pre = new Set<DuplicateNodeInfo>()) => {
          pre.delete(duplicateNodeInfo!)
          return pre
        })
      }
    }
  }, [getWrapperPosition, nodeProxy.id, parentStructureInfo, wrapperRef])
}

export const getLeftTop = ({ x, y, width, height }: StaticPosition): Point => ({
  x: Math.min(x, x + width),
  y: Math.min(y, y + height)
})
