import React, { FC, memo, useState, useEffect } from 'react'
import * as Y from 'yjs'
import { SelectedNodeInfoSubject } from '../../../../components/GlazeEditor/state'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'
import { Box, Divider, Flex, Tag } from '@chakra-ui/react'
import LayoutPanel from './LayoutPanel'
import NameIdPanel from './NameIdPanel'
import RoutePanel from './RoutePanel'
import PropsPanel from './PropsPanel'

export interface RightBarProps {}
const RightBar: FC<RightBarProps> = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [selectedYMap, setSelectedYMap] = useState<Y.Map<any>>()
  const [idInfo, setIdInfo] = useState<string>('')
  const [nameInfo, setNameInfo] = useState<any>()
  const [propsInfo, setPropsInfo] = useState<any>()
  const [layoutInfo, setLayoutInfo] = useState<Y.Map<any>>()
  const [pathInfo, setPathInfo] = useState<string>('')
  const [toInfo, setToInfo] = useState<string>('')

  useEffect(() => {
    const selectCertainNode = (nodeId: string) => {
      const nodeInfo = editorSharedDocument.getNodeById(nodeId)
      console.log('[selectedCertainNode]', nodeInfo)
      nodeInfo && yjsMapExtractor(nodeInfo)
      nodeInfo && setSelectedYMap(nodeInfo)
    }

    const yjsMapExtractor = (YMap: Y.Map<any>) => {
      const idInfo = YMap.get('id')
      const nameInfo = YMap.get('name')
      const propsInfo = YMap.get('props')
      const layoutInfo = YMap.get('layout')
      const pathInfo = YMap.get('path')
      const toInfo = YMap.get('to')
      // console.log('[yjsMapExtractor nameInfo]', nameInfo)
      // console.log('[yjsMapExtractor props]', propsInfo)
      // console.log('[yjsMapExtractor layout]', layoutInfo)
      setIdInfo(idInfo)
      setNameInfo(nameInfo)
      setPropsInfo(propsInfo)
      setLayoutInfo(layoutInfo)
      setPathInfo(pathInfo)
      setToInfo(toInfo)
    }

    const subscriber = SelectedNodeInfoSubject.subscribe((node) => {
      setSelectedNode(node)
      selectCertainNode(node || '')
    })

    return () => {
      subscriber.unsubscribe()
    }
  }, [])

  return (
    <Box w="250px" className="border-l" padding="10px">
      {selectedNode ? (
        <>
          {' '}
          <NameIdPanel nameInfo={nameInfo} idInfo={idInfo} />
          <Divider margin="10px 0" />
          <Flex overflow="scroll" h="500px" flexDirection="column">
            {layoutInfo && <LayoutPanel layoutInfo={layoutInfo} />}
            <PropsPanel />
            <Tag size="md" variant="solid" colorScheme="teal" margin="10px 0" width="60px">
              Routes
            </Tag>
            {selectedYMap && pathInfo !== '' && <RoutePanel path={pathInfo} yMap={selectedYMap} />}
            {selectedYMap && toInfo !== '' && <RoutePanel to={toInfo} yMap={selectedYMap} />}
          </Flex>
        </>
      ) : (
        '尚未选中元素'
      )}
    </Box>
  )
}

export default memo(RightBar)
