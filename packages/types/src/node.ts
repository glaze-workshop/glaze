export enum NodeType {
  DOCUMENT = 'DOCUMENT',
  CANVAS = 'CANVAS'
}

export interface AbstractNode {
  /** A string uniquely identifying this node within the document. */
  id: string

  /** The name given to the node by the user in the tool. */
  name: string

  /** Whether or not the node is visible on the canvas. */
  visible: string

  /** The type of the node, refer to table below for details. */
  type: NodeType
}

export interface DocumentNode extends AbstractNode {
  type: NodeType.DOCUMENT

  /** An array of canvases attached to the document */
  children: Node[]
}

export interface CanvasNode extends AbstractNode {
  type: NodeType.CANVAS

  /** An array of top level layers on the canvas */
  children: Node[]

  /** Background color of the canvas. */
  backgroundColor: string
}

export type Node = DocumentNode | CanvasNode
