import React, { FC, memo, useEffect, useState } from 'react'
import { Box, Flex, List, ListItem, Spacer } from '@chakra-ui/react'
import NodeTree from './NodeTree'
import Split from '@uiw/react-split'
import { useCustomComponentList } from '../../../../components/GlazeEditor/customSupport'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'

export interface LeftBarProps {}

const LeftBar: FC<LeftBarProps> = () => {
  const componentList = useCustomComponentList()

  return (
    <Split mode="vertical" style={{ width: 250 }} className="border-r h-full">
      <div style={{ height: '50%' }} className="overflow-auto">
        <NodeTree />
      </div>
      <div style={{ height: '50%' }}>
        <Box bg="gray.100" p={2}>
          自定义组件
        </Box>
        <List spacing={2}>
          {componentList.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => editorSharedDocument.createNodeByComponentId(item.id)}
            >
              {item.name}
            </ListItem>
          ))}
        </List>
      </div>
    </Split>
  )
}
export default memo(LeftBar)
