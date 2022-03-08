import { BehaviorSubject } from 'rxjs'
import * as Y from 'yjs'
import { NodeProxy, StructureProxy } from './yjs.hook'
import { ComponentFullInfo, createBasicComponentMap } from '../BasicComponents/basicComponentMap'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { editorSharedDocument } from './EditorSharedDocument'

export interface SelectedNodeInfo {
  nodeProxy: NodeProxy
  parentStructureInfo?: Y.Map<any>
  structureProxy: StructureProxy
  wrapper: HTMLDivElement
}

export const SelectedNodeInfoSubject = new BehaviorSubject<SelectedNodeInfo | null>(null)

export const EditorPositionSubject = new BehaviorSubject<DOMRect | null>(null)

export const AllComponentsSubject = new BehaviorSubject<Map<string, ComponentFullInfo>>(createBasicComponentMap())

export const refreshEditorState = () => {
  SelectedNodeInfoSubject.next(null)
  EditorPositionSubject.next(null)
  AllComponentsSubject.next(createBasicComponentMap())
}

/**
 * projectId 变化更新状态
 */
export const useProjectIdChange = () => {
  const { projectId } = useParams<{projectId: string}>()
  useEffect(() => {
    if (projectId) {
      const projectIdNum = Number(projectId)
      editorSharedDocument.connect(projectIdNum)
    }
    return () => {
      editorSharedDocument.close()
      refreshEditorState()
    }
  }, [projectId])
}
