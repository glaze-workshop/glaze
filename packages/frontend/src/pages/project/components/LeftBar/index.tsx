import React, { FC, memo, useEffect, useState } from 'react'
import { Box, Flex, Kbd, List, ListItem, Spacer } from '@chakra-ui/react'
import NodeTree from './NodeTree'
import Split from '@uiw/react-split'
import { useCustomComponentList } from '../../../../components/GlazeEditor/customSupport'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'
import { useSharedComponentList } from '../../../../components/GlazeEditor/customSupport/shared.hook'

export interface LeftBarProps {}

const LeftBar: FC<LeftBarProps> = () => {
  const componentList = useCustomComponentList()
  const { componentList: sharedComponentList } = useSharedComponentList()

  return (
    <Split mode="vertical" style={{ width: 250 }} className="border-r h-full">
      <div style={{ height: '50%' }} className="overflow-auto">
        <NodeTree />
      </div>
      <div style={{ height: '25%' }}>
        <Box bg="gray.100" className="border-b" p={2}>
          可用组件
        </Box>
        <List spacing={2}>
          {sharedComponentList.map((item) => (
            <ListItem
              className="border-b"
              cursor="pointer"
              _hover={{ bg: 'gray.200' }}
              key={item.id}
              p={2}
              onClick={() => editorSharedDocument.createNodeByComponentId(item.id)}
            >
              <Box>{item.name}</Box>
              <Kbd fontSize="xs">{item.id}</Kbd>
            </ListItem>
          ))}
        </List>
      </div>
      <div style={{ height: '25%' }}>
        <Box bg="gray.100" p={2}>
          自定义组件
        </Box>
        <List spacing={2}>
          {componentList.map((item) => (
            <ListItem
              key={item.id}
              className="border-b"
              cursor="pointer"
              _hover={{ bg: 'gray.200' }}
              p={2}
              onClick={() => editorSharedDocument.createNodeByComponentId(item.id)}
            >
              <Box>{item.name}</Box>
              <Kbd fontSize="xs">{item.id}</Kbd>
            </ListItem>
          ))}
        </List>
      </div>
    </Split>
  )
}
export default memo(LeftBar)
