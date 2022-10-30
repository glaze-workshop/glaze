import React, { FC, memo, useCallback, useMemo } from 'react'
import {
  NodeProxy,
  StructureProxy,
  useYjsMapProxy,
  useYjsRerender
} from '../../../../components/GlazeEditor/yjs.hook'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'
import * as Y from 'yjs'
import { useObservableEagerState } from 'observable-hooks'
import { SelectedNodeInfoSubject } from '../../../../components/GlazeEditor/state'
import { Box, Collapse, Icon, List, ListIcon, ListItem, useDisclosure } from '@chakra-ui/react'
import { map } from 'rxjs'
import { FiCornerDownRight, FiMinus, FiMinusSquare, FiPlusSquare } from 'react-icons/fi'

export interface NodeItemProps {
  nodeInfo: Y.Map<any>
  structureInfo: Y.Map<any>
  deep: number
}

const NodeItem: FC<NodeItemProps> = ({ nodeInfo, structureInfo, deep }) => {
  const nodeProxy = useYjsMapProxy<NodeProxy>(nodeInfo)
  const structureProxy = useYjsMapProxy<StructureProxy>(structureInfo)
  useYjsRerender(nodeInfo, nodeProxy.props, structureProxy.children)

  const selected$ = useMemo(
    () => SelectedNodeInfoSubject.pipe(map((id) => id === nodeProxy.id)),
    [nodeProxy.id]
  )
  const isSelected = useObservableEagerState(selected$)
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true })

  const handleClick = useCallback(() => {
    SelectedNodeInfoSubject.next(nodeProxy.id)
  }, [nodeProxy.id])

  return (
    <>
      <ListItem
        px={2}
        py={1}
        cursor="pointer"
        w="full"
        onClick={handleClick}
        bg={isSelected ? 'blue.50' : ''}
      >
        <ListIcon onClick={onToggle} as={isOpen ? FiMinusSquare : FiPlusSquare} />
        <Box display="inline">{nodeProxy.name}</Box>
      </ListItem>
      <Collapse in={isOpen} animateOpacity>
        <List w="full" paddingLeft={3 * (deep + 1)}>
          {structureProxy.children.map((children) => (
            <NodeItem
              key={children.get('nodeId')}
              nodeInfo={editorSharedDocument.nodeList.get(children.get('nodeId'))!}
              structureInfo={children}
              deep={deep + 1}
            />
          ))}
        </List>
      </Collapse>
    </>
  )
}

const MemoNodeItem = memo(NodeItem)

export interface NodeTreeProps {}

const NodeTree: FC<NodeTreeProps> = () => {
  useYjsRerender(editorSharedDocument.structureTree)
  return (
    <List w="full">
      {editorSharedDocument.structureTree.map((node) => {
        const nodeInfo = editorSharedDocument.mapStructureTreeNodeToNode(node)
        return (
          <MemoNodeItem
            key={node.get('nodeId')}
            structureInfo={node}
            nodeInfo={nodeInfo!}
            deep={0}
          ></MemoNodeItem>
        )
      })}
    </List>
  )
}

export default memo(NodeTree)
