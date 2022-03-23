import { Box } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentRouterMatch } from '../../hooks/router.hook'

export interface NavLinkProps {
  to: string
}
const NavLink:FC<NavLinkProps> = ({ to, children }) => {
  const isMatch = useCurrentRouterMatch(to)
  return (
    <Box as={Link} to={to} cursor="pointer" bg={isMatch ? 'gray.200' : 'transparent'} p="3px 15px" rounded="base">
      {children}
    </Box>
  )
}
export default NavLink
