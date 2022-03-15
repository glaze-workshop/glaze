import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'

import SideBar from './components/SideBar'

const Home:FC = () => {
  return (
    <Flex h="100vh" overflow="hidden">
      <Box w="270px" bg="gray.100">
        <SideBar />
      </Box>
      <Box flex="1">
        <Outlet />
      </Box>
    </Flex>
  )
}
export default Home
