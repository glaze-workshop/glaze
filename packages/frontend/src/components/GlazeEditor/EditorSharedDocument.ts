import { nanoid } from 'nanoid'
import * as Y from 'yjs'
import { ComponentConfig } from '../../schema/config'
import { LayoutConfig, PositionConfig, PositionType } from '../../schema/layout'
import { BasicComponentId } from '../BasicComponents/basicComponentInfo'
import { WebSocketProvider } from './provider/WebsocketProvider'
import { AllComponentsSubject, AllNodeInfoObservableMap, SelectedNodeInfoSubject } from './state'
import { StructureProxy, createYjsMapProxy, NodeProxy } from './yjs.hook'

/**
 * @example
 * ```ts
 * {
 *   structure: {
 *    nodeId: string,
 *    children: structure[]
 *   },
 *   components: Map<id, detail>
 * }
 * ```
 */

export default class EditorSharedDocument {
  doc
  structureTree
  nodeList
  webSocketProvider: WebSocketProvider | null = null

  constructor () {
    this.doc = new Y.Doc()
    this.structureTree = this.doc.getArray<Y.Map<any>>('structure')
    this.nodeList = this.doc.getMap<Y.Map<any>>('components')

    this.doc.on('update', function (...args) {
      console.log('[EditorSharedDocument] args:', args)
      console.log('[EditorSharedDocument] args:', editorSharedDocument)
    })
  }

  connect (projectId: number) {
    this.webSocketProvider = new WebSocketProvider(`ws://localhost:3000/ws-doc?projectId=${projectId}`, String(projectId), this.doc)
  }

  /** TODO: close websocket */
  close () {
    this.webSocketProvider?.disconnect()
  }

  getNodeById = (nodeId: string) => {
    return this.nodeList.get(nodeId)
  }

  mapStructureTreeNodeToNode = (structure: Y.Map<any>) => {
    return this.nodeList.get(structure.get('nodeId'))
  }

  createNodeByComponentId = (componentId: string) => {
    const { component, config } = AllComponentsSubject.value.get(componentId) ?? {}
    console.log('createNodeByComponentId 1', config)
    if (componentId === BasicComponentId.Screen && config) {
      const leftMax = this.structureTree.toArray().map((item) => {
        const node = this.mapStructureTreeNodeToNode(item)
        return node?.get('layout')
      }).filter(Boolean)
        .reduce((acc, cur: Y.Map<any>) => {
          const width = cur.get('width')[1] ?? 0
          const positionLeft = cur.get('position').left ?? 0
          return Math.max(acc, width + positionLeft)
        }, 0)
      this.createNode(config, null, {
        left: leftMax + 100,
        top: 100,
        type: [PositionType.LEFT, PositionType.TOP]
      })
    }
    console.log('createNodeByComponentId 2', SelectedNodeInfoSubject)

    const selectedNodeSubject = AllNodeInfoObservableMap.getValueSubject(SelectedNodeInfoSubject.value)?.value
    // 选中节点
    if (selectedNodeSubject) {
      console.log('selectedNodeSubject', selectedNodeSubject)
      const { nodeProxy, parentStructureInfo, structureProxy } = selectedNodeSubject

      const { component: selectedComponent, config: selectedComponentConfig } =
        AllComponentsSubject.value.get(nodeProxy.componentId) ?? {}

      if (component && config && selectedComponent && selectedComponentConfig) {
        // 创建在当前节点内部还是创建在父节点内部
        const targetChildrenArray: Y.Array<Y.Map<any>> = selectedComponentConfig.hasChildren
          ? structureProxy.children
          : parentStructureInfo?.get('children')
        const calculatePosition = (): PositionConfig => {
          const maxTop = targetChildrenArray.toArray()
            .map(this.mapStructureTreeNodeToNode)
            .filter(Boolean)
            .reduce((acc, cur) => {
              const layout = cur?.get('layout')
              const height = layout.get('height')[1] ?? 0
              const top = layout.get('position').top ?? 0
              return Math.max(acc, height + top)
            }, 0)
          return {
            left: 0,
            top: maxTop,
            type: [PositionType.LEFT, PositionType.TOP]
          }
        }
        this.createNode(config,
          selectedComponentConfig.hasChildren ? structureProxy.yNode : parentStructureInfo,
          calculatePosition())
      }
    }
  }

  createNode = (componentConfig: ComponentConfig, inParent?: Y.Map<any> | null, position: PositionConfig = {
    left: 0,
    top: 0,
    type: [PositionType.LEFT, PositionType.TOP]
  }) => {
    const nodeId = nanoid()
    // 创建节点流程:  props -> props, default layout -> layout
    const { id: componentId, props, defaultSize, name } = componentConfig

    this.doc.transact(() => {
      {
        const yStructureMap = new Y.Map()
        const structure = createYjsMapProxy<StructureProxy>(yStructureMap)
        structure.nodeId = nodeId
        structure.children = new Y.Array()
        if (inParent) {
          inParent.get('children').push([yStructureMap])
        } else {
          this.structureTree.push([yStructureMap])
        }
      }

      {
        const yNodeMap = new Y.Map()
        const node = createYjsMapProxy<NodeProxy>(yNodeMap)
        node.id = nodeId
        node.name = name
        node.componentId = componentId

        const yLayoutMap = new Y.Map()
        const layout = createYjsMapProxy<LayoutConfig>(yLayoutMap)
        layout.width = defaultSize.width
        layout.height = defaultSize.height
        layout.position = position

        node.layout = yLayoutMap

        const yPropsMap = new Y.Map()
        for (const [key, value] of Object.entries(props)) {
          yPropsMap.set(key, value.default)
        }
        node.props = yPropsMap

        this.nodeList.set(nodeId, yNodeMap)
      }
    })
  }
}

export const editorSharedDocument = new EditorSharedDocument()
