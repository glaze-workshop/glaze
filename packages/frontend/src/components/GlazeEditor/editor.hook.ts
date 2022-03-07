import { useCallback } from 'react'
import { PositionConfig } from '../../schema/layout'
import { BasicComponentId } from '../BasicComponents/basicComponentInfo'
import { AllComponentsSubject, SelectedNodeInfoSubject } from './state'
import EditorSharedDocument from './EditorSharedDocument'

export function useEditorControl (sharedDocument: EditorSharedDocument) {
  const createComponent = useCallback((id: BasicComponentId, position?: PositionConfig) => {
    const componentInfo = AllComponentsSubject.value.get(id)
    const [node] = SelectedNodeInfoSubject.value

    if (componentInfo) {
      sharedDocument.createNode(componentInfo.config)
    }
  }, [sharedDocument])
}
