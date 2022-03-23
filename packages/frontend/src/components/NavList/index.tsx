import { VStack } from '@chakra-ui/react'
import React, { FC, memo } from 'react'

export interface NavListProps {

}
const NavList:FC<NavListProps> = ({ children }) => {
  return <VStack>
    {children}
  </VStack>
}
export default memo(NavList)
