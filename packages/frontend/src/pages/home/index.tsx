import { Box, Flex } from '@chakra-ui/react'
import { SelfApi } from '@glaze/common'
import React, { FC, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Outlet } from 'react-router-dom'
import { useCurrentUser, useUserTeams } from '../../hooks/self.hook'
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
