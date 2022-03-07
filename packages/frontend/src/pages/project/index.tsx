import { Box, Flex } from '@chakra-ui/react'
import React, { FC, memo } from 'react'
import Center from './components/Center'
import LeftBar from './components/LeftBar'
import RightBar from './components/RightBar'
import TopNav from './components/TopNav'

const Project:FC = () => {
  return (
    <Flex h="100vh" overflow="hidden" direction="column">
      <TopNav/>
      <Flex h="full" flex={1}>
        <LeftBar/>
        <Box flex={1} overflow="hidden" alignItems="stretch">
          <Center />
        </Box>
        <RightBar/>
      </Flex>
    </Flex>
  )
}

export default memo(Project)
