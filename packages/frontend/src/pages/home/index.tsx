import React, { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Box, Flex } from '@chakra-ui/react'
import { EditorRequestType, LCPClient, LCPSocket } from '@glaze/common'

import { useCurrentUser, useUserTeams } from '../../hooks/self.hook'
import SideBar from './components/SideBar'

const Home:FC = () => {
  useEffect(() => {
    console.log('>>>>> Home mounted')
    const client = new LCPClient(new LCPSocket({ url: 'ws://localhost:8999/ws', heartbeat: true }))

    client.request(EditorRequestType.ComponentList).then(res => {
      console.log('getComponentList', res)
    }).catch(err => {
      console.log('getComponentList error', err)
    })

    client.subscribe('componentList', undefined, (data) => {
      console.log('componentList', data)
    }).then((unsubscribe) => {
      console.log('unsubscribe', unsubscribe)

      setTimeout(() => {
        unsubscribe()
      }, 10 * 1000)
    })
  }, [])

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
