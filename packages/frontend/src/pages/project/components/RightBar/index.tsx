import React, { FC, memo, useState, useEffect } from 'react'
import * as Y from 'yjs'
import { SelectedNodeInfoSubject } from '../../../../components/GlazeEditor/state'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'
import { Box, Tag, Divider } from '@chakra-ui/react'
import LayoutPanel from './LayoutPanel'
import NameIdPanel from './NameIdPanel'

export interface RightBarProps {}
const RightBar: FC<RightBarProps> = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [idInfo, setIdInfo] = useState<string>('')
  const [nameInfo, setNameInfo] = useState<any>()
  const [propsInfo, setPropsInfo] = useState<any>()
  const [layoutInfo, setLayoutInfo] = useState<Y.Map<any>>()

  useEffect(() => {
    const subscriber = SelectedNodeInfoSubject.subscribe((node) => {
      setSelectedNode(node)
    })
    selectCertainNode()

    return () => {
      subscriber.unsubscribe()
    }
  })

  const selectCertainNode = () => {
    const nodeInfo = editorSharedDocument.getNodeById(selectedNode)
    // console.log('[selectedCertainNode]', nodeInfo)
    nodeInfo && yjsMapExtractor(nodeInfo)
  }

  const yjsMapExtractor = (YMap: Y.Map<any>) => {
    const idInfo = YMap.get('id')
    const nameInfo = YMap.get('name')
    const propsInfo = YMap.get('props')
    const layoutInfo = YMap.get('layout')
    // console.log('[yjsMapExtractor nameInfo]', nameInfo)
    // console.log('[yjsMapExtractor props]', propsInfo)
    console.log('[yjsMapExtractor layout]', layoutInfo)
    setIdInfo(idInfo)
    setNameInfo(nameInfo)
    setPropsInfo(propsInfo)
    setLayoutInfo(layoutInfo)
  }

  return (
    <Box w="250px" className="border-l" padding="10px">
      {selectedNode ? (
        <>
          {' '}
          <NameIdPanel nameInfo={nameInfo} idInfo={idInfo} />
          <Divider margin="10px 0" />
          <Box overflow="scroll" h="500px">
            {layoutInfo && <LayoutPanel layoutInfo={layoutInfo} />}
            <Tag size="md" variant="solid" colorScheme="teal" margin="10px 0">
              Props
            </Tag>{' '}
          </Box>
        </>
      ) : (
        '尚未选中元素'
      )}
    </Box>
  )
}

export default memo(RightBar)
