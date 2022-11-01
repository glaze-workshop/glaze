import { nanoid } from 'nanoid'
import { ReplaySubject, Subject } from 'rxjs'
import * as Y from 'yjs'
import { ComponentConfig, LayoutConfig, PositionConfig, PositionType } from '@glaze/types'
import { BasicComponentId } from '../BasicComponents/basicComponentInfo'
import { GlazeAwarenessState, WebSocketProvider } from './provider/WebsocketProvider'
import {
  AllComponentsSubject,
  AllNodeInfoObservableMap,
  FullNodeInfo,
  SelectedNodeInfoSubject,
  StaticPosition
} from './state'
import {
  createYjsMapProxy,
  getChildrenInStructTree,
  getNodeIdInStructTree,
  NodeProxy,
  StructureProxy
} from './yjs.hook'
import { wsUrl } from '@glaze/common/src/websocket/url'
import { Point } from '@glaze/zoom'
import { LengthUnit } from '@glaze/types'
import { notEmpty } from '@glaze/common'

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
  doc: Y.Doc
  structureTree: Y.Array<Y.Map<any>>
  nodeList: Y.Map<Y.Map<any>>
  webSocketProvider: WebSocketProvider | null = null

  webSocketProviderSubject = new ReplaySubject<WebSocketProvider | null>(1)

  constructor() {
    this.doc = new Y.Doc()
    this.structureTree = this.getStructTree(this.doc)
    this.nodeList = this.getNodeList(this.doc)
  }
  connect = (projectId: number, listener: Subject<GlazeAwarenessState[]>) => {
    const provider = new WebSocketProvider(
      `${wsUrl()}/ws-doc?projectId=${projectId}`,
      String(projectId),
      this.doc,
      listener
    )
    this.webSocketProvider = provider
    this.webSocketProviderSubject.next(provider)
  }

  /** TODO: close websocket */
  close = () => {
    console.log('done')
    this.webSocketProviderSubject.next(null)
    this.webSocketProvider?.destroy()
    this.doc = new Y.Doc()
    this.structureTree = this.getStructTree(this.doc)
    this.nodeList = this.getNodeList(this.doc)
  }

  getStructTree = (doc = this.doc) => doc.getArray<Y.Map<any>>('structure')
  getNodeList = (doc = this.doc) => doc.getMap<Y.Map<any>>('components')

  getNodeById = (nodeId: string) => {
    return this.nodeList.get(nodeId)
  }

  mapStructureTreeNodeToNode = (structure: Y.Map<any>) => {
    return this.nodeList.get(structure.get('nodeId'))
  }

  createNodeByComponentId = (componentId: string) => {
    console.log(AllComponentsSubject)
    const { component, config } = AllComponentsSubject.value.get(componentId) ?? {}
    if (componentId === BasicComponentId.Screen && config) {
      const leftMax = this.structureTree
        .toArray()
        .map((item) => {
          const node = this.mapStructureTreeNodeToNode(item)
          return node?.get('layout')
        })
        .filter(Boolean)
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
      return
    }

    const selectedNodeSubject =
      SelectedNodeInfoSubject.value &&
      AllNodeInfoObservableMap.getValueSubject(SelectedNodeInfoSubject.value)?.value
    // 选中节点
    if (selectedNodeSubject) {
      const { nodeProxy, parentStructureInfo, structureProxy } = selectedNodeSubject

      const { component: selectedComponent, config: selectedComponentConfig } =
        AllComponentsSubject.value.get(nodeProxy.componentId) ?? {}

      if (component && config && selectedComponent && selectedComponentConfig) {
        // 创建在当前节点内部还是创建在父节点内部
        const targetChildrenArray: Y.Array<Y.Map<any>> = selectedComponentConfig.hasChildren
          ? structureProxy.children
          : parentStructureInfo?.get('children')
        const calculatePosition = (): PositionConfig => {
          const maxTop = targetChildrenArray
            .toArray()
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
        this.createNode(
          config,
          selectedComponentConfig.hasChildren ? structureProxy.yNode : parentStructureInfo,
          calculatePosition()
        )
      }
    }
  }

  createNode = (
    componentConfig: ComponentConfig,
    inParent?: Y.Map<any> | null,
    position: PositionConfig = {
      left: 0,
      top: 0,
      type: [PositionType.LEFT, PositionType.TOP]
    }
  ) => {
    const nodeId = nanoid()
    // 创建节点流程:  props -> props, default layout -> layout

    this.doc.transact(({ doc }) => {
      const { id: componentId, props, defaultSize, name, path, to } = componentConfig
      {
        const yStructureMap = new Y.Map()
        const structure = createYjsMapProxy<StructureProxy>(yStructureMap)
        structure.nodeId = nodeId
        structure.children = new Y.Array()
        if (inParent) {
          inParent.get('children').push([yStructureMap])
        } else {
          this.getStructTree(doc).push([yStructureMap])
        }
      }

      {
        const yNodeMap = new Y.Map()
        const node = createYjsMapProxy<NodeProxy>(yNodeMap)
        node.id = nodeId
        node.name = name
        node.componentId = componentId
        node.path = path
        node.to = to

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
        this.getNodeList(doc).set(nodeId, yNodeMap)
      }
    })
  }

  // performance !
  /**
   * 移动！
   * @param nextPos 鼠标的位置
   * @param info 全量的组件信息
   * @param relativePos 最开始点击与鼠标的偏移
   */
  moveNode = (nextPos: Point, info: FullNodeInfo, relativePos: Point) => {
    this.doc.transact(() => {
      const structTree = this.getStructTree()
      const selectedNodeId = info.nodeProxy.id
      const [parentTree, leftTop] = this.recursionTravel(nextPos, selectedNodeId, true)
      let targetParentChildrenList: Y.Array<any> | null = null
      if (parentTree) {
        targetParentChildrenList = getChildrenInStructTree(parentTree.structureProxy.yNode)
      }

      if (!targetParentChildrenList) {
        targetParentChildrenList = structTree
      }

      const childrenList: Y.Array<any> = info.parentStructureInfo
        ? getChildrenInStructTree(info.parentStructureInfo)
        : structTree

      if (targetParentChildrenList !== childrenList) {
        const arr = childrenList.toArray()
        for (let i = 0; i < arr.length; i++) {
          const child: Y.Map<any> = arr[i]
          if (selectedNodeId === getNodeIdInStructTree(child)) {
            const newChild = child.clone()
            childrenList.delete(i, 1)
            targetParentChildrenList.push([newChild])
            break
          }
        }
      }

      const node = this.nodeList.get(selectedNodeId)
      if (node) {
        const layout = node.get('layout')
        const width = info.position.width
        const height = info.position.height
        layout.set('width', [LengthUnit.FIXED, width])
        layout.set('height', [LengthUnit.FIXED, height])
        layout.set('position', {
          left: nextPos.x - leftTop.x - relativePos.x,
          top: nextPos.y - leftTop.y - relativePos.y,
          type: [PositionType.LEFT, PositionType.TOP]
        })
      }
    })
  }

  recursionTravel = (
    p: Point,
    excludeId?: string,
    ignoreNoChildren = false
  ): [FullNodeInfo | null, Point] => {
    const allNodeMap = AllNodeInfoObservableMap.mapSubject.value
    function recursionTravelExcludeChild(id: string, preSet = new Set<string>()): Set<string> {
      const ignoreNode = allNodeMap.get(id)
      if (ignoreNode) {
        preSet.add(id)
        return ignoreNode.value.structureProxy.children
          .map((item) => recursionTravelExcludeChild(getNodeIdInStructTree(item)))
          .reduce((pre, cur) => {
            cur.forEach((item) => pre.add(item))
            return pre
          }, preSet)
      }
      return preSet
    }

    const excludeSet = new Set<string>()
    if (notEmpty(excludeId)) {
      recursionTravelExcludeChild(excludeId, excludeSet)
    }

    let bestParentInfo: FullNodeInfo | null = null
    let bestParentLeftTop: Point = { x: 0, y: 0 }
    for (const [id, infoSubject] of allNodeMap) {
      const fullNodeInfo = infoSubject.value
      if (!excludeSet.has(id)) {
        if (bestParentInfo && bestParentInfo.deep > fullNodeInfo.deep) {
          continue
        }

        if (ignoreNoChildren) {
          const componentId = fullNodeInfo.nodeProxy.componentId
          const componentInfo = AllComponentsSubject.value.get(componentId)
          if (!componentInfo?.config.hasChildren) {
            continue
          }
        }

        const { x, y, width, height } = fullNodeInfo.position
        const leftTop = { x: Math.min(x, x + width), y: Math.min(y, y + height) }
        const rightBottom = { x: Math.max(x, x + width), y: Math.max(y, y + height) }
        if (p.x >= leftTop.x && p.x <= rightBottom.x && p.y >= leftTop.y && p.y <= rightBottom.y) {
          bestParentInfo = fullNodeInfo
          bestParentLeftTop = leftTop
        }
      }
    }
    return [bestParentInfo ?? null, bestParentLeftTop]
  }

  selectNode = (p: Point) => {
    const [structNode] = this.recursionTravel(p)
    const id = structNode?.structureProxy.yNode
      ? getNodeIdInStructTree(structNode?.structureProxy.yNode)
      : null
    SelectedNodeInfoSubject.next(id)
    return id
  }

  deleteNode = (nodeId?: string | null) => {
    if (!notEmpty(nodeId)) {
      return
    }

    const allNodeMap = AllNodeInfoObservableMap.mapSubject.value
    const info = allNodeMap.get(nodeId)?.value
    if (info) {
      this.doc.transact(() => {
        const children = info.parentStructureInfo
          ? getChildrenInStructTree(info.parentStructureInfo)
          : this.structureTree
        const arr = children.toArray()
        for (let i = 0; i < arr.length; i++) {
          const id = getNodeIdInStructTree(arr[i])
          if (id === nodeId) {
            children.delete(i, 1)
          }
        }
      })
    }
  }

  deleteNodeInParent = (
    nodeId: string,
    structTreeChildrenArr: Y.Array<Y.Map<any>> = this.structureTree
  ) => {
    this.doc.transact(() => {
      const arr = structTreeChildrenArr.toArray()
      for (let i = 0; i < arr.length; i++) {
        const id = getNodeIdInStructTree(arr[i])
        if (id === nodeId) {
          structTreeChildrenArr.delete(i, 1)
        }
      }
    })
  }
}
export const editorSharedDocument = new EditorSharedDocument()
