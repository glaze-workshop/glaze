import { Box, Flex } from '@chakra-ui/react'
import React, { FC } from 'react'
import UserBar from '../UserBar'
import TeamList from '../TeamList'

export interface SideBarProps {

}
const SideBar:FC<SideBarProps> = () => {
  return (
    <Flex direction="column" h="100%">
      <UserBar />
      <TeamList />
    </Flex>
  )
}
export default SideBar
