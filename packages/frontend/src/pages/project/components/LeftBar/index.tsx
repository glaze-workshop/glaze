import React, { FC, memo, useEffect, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import NodeTree from './NodeTree'
import Split from '@uiw/react-split'

export interface LeftBarProps {}
const LeftBar: FC<LeftBarProps> = () => {
  return (
    <Split mode="vertical" style={{ width: 250 }} className="border-r h-full">
      <div style={{ height: '50%' }} className="overflow-auto">
        <NodeTree />
      </div>
      <div style={{ height: '50%' }}>custom components</div>
    </Split>
  )
}
export default memo(LeftBar)
